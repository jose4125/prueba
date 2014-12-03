exports.findOrCreateSocialUser = function (service, profile, callback){

	SocialAccount.find({
		'socialId' : profile.id,
		'socialType': service
	})
	.populate("user")
	.exec(function(error,user){

		if( !_.isEmpty(user) ){
			callback(null,user[0].user);

		}else{  

			var randomPass = "",
	          	characters = "abcdefghijklmnropqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
	    
			for (i=0; i<7; i++) {
				randomPass += characters.charAt(Math.floor(Math.random()*characters.length));
			}
	
			var firstName = profile._json.first_name || profile._json.firstName,
	          	lastName = profile._json.last_name || profile._json.lastName,
	          	userEmail = profile._json.email || profile._json.emailAddress;
				
			if(!userEmail){
				callback({error: 'email_privacy_enabled'}, null);
				return;
			}
	
	
			var userObject = {
					first_name:firstName,
					last_name:lastName,
					email:userEmail,
					password:randomPass,
					confirm_password:randomPass
					
			}

			
			if(service == 'facebook'){
				userObject.profilePicture =  'http://graph.facebook.com/'+profile.id+'/picture?type=normal';
			}
			if(profile._json.pictureUrl){
				userObject.profilePicture =  profile._json.pictureUrl;
			}
			
			if(profile._json.location && profile._json.location.name){
				userObject.location =  profile._json.location.name;
			}
	
			User.findByEmail(userEmail, function(err, user){
				
				if( _.isEmpty(user) ){
					User.create(userObject, function(err, newUser){
						if( !_.isEmpty(newUser) ) {
							SocialAccount.create({user:newUser.id, socialType:service, socialId:profile.id, profilePicture:userObject.profilePicture}, function(err, socialAccountData){
								
								Role.findOne({name:'Consumer'}).exec(function(err,role){
									User.update({id:newUser.id}, {socialAccounts: socialAccountData.id, role:role.id}, function(err, updatedUser){
										if( !_.isEmpty(updatedUser) ){
											if(updatedUser.length > 0){
												callback(null,updatedUser[0]);
											}else{
												callback(null,updatedUser);
											}
										}else{

											callback(err,null);
										}
		                      
									});
								});
	
							});
	
	               
						}else{

							return callback(error,null);
						}
	
					});
	
				}else{
	        
					SocialAccount.create({user:user[0].id, socialType:service, socialId:profile.id, profilePicture: userObject.profilePicture}, function(err, socialAccountData){

						SocialAccount.findOne({
							id : socialAccountData.id,
						})
						.populate("user")
						.exec(function(error,socialUser){
							
							if(error){
								
								callback(error,null);
							}else{
								if( !_.isEmpty(socialUser) ){
									
									callback(null,socialUser.user);
								}else{
									callback(error,null);
								}
							}
						});

					});
	
	
				}
	
			});

		}

	});

}