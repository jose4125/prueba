exports.findOrCreateSocialUser = function (service, profile, callback){

	SocialAccount.find({
		'socialId' : profile.id,
		'socialType': service
	})
	.populate("user")
	.exec(function(error,user){




			var userObject = {
					first_name:firstName,
					last_name:lastName,
					email:userEmail,
					password:randomPass,
					confirm_password:randomPass

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
