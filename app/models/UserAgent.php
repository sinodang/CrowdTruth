<?php

use Jenssegers\Mongodb\Sentry\User as SentryUser;
use Illuminate\Auth\UserInterface;

/**
 * This class defines a user in the CrowdTruth platform.
 */
class UserAgent extends SentryUser implements UserInterface {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $collection = 'useragents';
	protected static $unguarded = true;
	
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = array('password');

	public function __construct()
	{
		$this->setHasher(new \Cartalyst\Sentry\Hashing\NativeHasher);
	}
	
	/**
	 * Get the unique identifier for the user.
	 *
	 * @return mixed
	 */
	public function getAuthIdentifier()
	{
		return $this->getKey();
	}

	/**
	 * Get the password for the user.
	 *
	 * @return string
	 */
	public function getAuthPassword()
	{
		return $this->password;
	}

	/**
	 * Get the e-mail address where password reminders are sent.
	 *
	 * @return string
	 */
	public function getReminderEmail()
	{
		return $this->email;
	}

	/**
	 * Get list of all users
	 */
	public static function getUserlist()
	{
		return UserAgent::orderBy('_id', 'asc')->get();
	}
	
	/**
	 * Establish how user ownership over activities is established.
	 */
	public function associatedActivities(){
		return $this->hasMany('Activity', 'user_id', '_id');
	}

	/**
	 * Establish how user ownership over entities is established.
	 */
	public function associatedEntities(){
		return $this->hasMany('Entity', 'user_id', '_id');
	}

	public function getRememberToken()
	{
		return $this->remember_token;
	}

	public function setRememberToken($value)
	{
		$this->remember_token = $value;
	}

	/**
	 * Name of remember token field.
	 * @return string
	 */
	public function getRememberTokenName()
	{
		return 'remember_token';
	}
	
	/**
	 * Override Jenssegers\Mongodb\Sentry\User.
	 */
	public function isActivated()
	{
		return true;
	}
	
	/**
	 * Used to indicate to Sentry which field is used for login.
	 * 
	 * @return Login name used to login to the platform.
	 */
	public function getLoginName()
	{
		return '_id';
	}
}
