<?php
/**
 * This model keeps track of the activities, for the purpose of data provenance
 */
class Activity extends Moloquent {

	protected $collection = 'activities';
	protected $softDelete = true;
	protected static $unguarded = true;
    public static $snakeAttributes = false;

    // TODO: add parameters to Activity
    public function __construct()
    {
        $this->filterResults();
        parent::__construct();
    }
	
    public function filterResults()
    {
        $input = Input::all();
        if(array_key_exists('wasAssociatedWithUserAgent', $input))    array_push($this->with, 'wasAssociatedWithUserAgent');
        if(array_key_exists('wasAssociatedWithCrowdAgent', $input))    array_push($this->with, 'wasAssociatedWithCrowdAgent');
        if(array_key_exists('wasAssociatedWithSoftwareAgent', $input))    array_push($this->with, 'wasAssociatedWithSoftwareAgent');
        if(array_key_exists('wasAssociatedWith', $input))    $this->with = array_merge($this->with, array('wasAssociatedWithUserAgent', 'wasAssociatedWithCrowdAgent', 'wasAssociatedWithSoftwareAgent'));
    }

    public static function boot()
    {
        parent::boot();

        static::saving(function($activity)
        {
            if(!Schema::hasCollection('activities'))
            {
                static::createSchema();
            }

            if(is_null($activity->_id))
            {
               $activity->_id = static::generateIncrementedBaseURI($activity);
            }

            if (Auth::check())
            {
                $activity->user_id = Auth::user()->_id;
            } else 
            {
                $activity->user_id = "crowdwatson";
            }                
        });
    }

    public static function generateIncrementedBaseURI($activity) {
    	$seqName = 'activity' . '/' . $activity->softwareAgent_id;
    	$id = Counter::getNextId($seqName);
        return $seqName.'/'.$id;
    }

	public static function createSchema() {
		Schema::create('activities', function($collection)
		{
		    $collection->index('type');
		    $collection->index('user_id');
		    $collection->index('softwareAgent_id');
		});
	}

	/**
     * Get activity for a user ordered by timestamp
     */
	public static function getActivitiesForUser($userId)
    {
        return Activity::where('user_id', $userId)->orderBy('updated_at', 'desc')->get();
    }

    public function wasAssociatedWithUserAgent(){
        return $this->hasOne('UserAgent', '_id', 'user_id');
    }

    public function wasAssociatedWithCrowdAgent(){
        return $this->hasOne('CrowdAgent', '_id', 'crowdAgent_id');
    }    

    public function wasAssociatedWithSoftwareAgent(){
        return $this->hasOne('SoftwareAgent', '_id', 'softwareAgent_id');
    }
}
