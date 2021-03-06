<?php

use \Entities\Job as Job;
use \Entities\Workerunit as Workerunit;
use \Entity as Entity;

class CrowdAgent extends Moloquent {

	protected $collection = 'crowdagents';
    protected $attributes = array(  'messagesRecieved' => array('count'=>0, 'messages'=>[]), 
                                    'flagged' => false, 
                                    'blocked' => false,
                                    'avg_agreement'=>0.0, 
                                    'avg_cosine'=>0.0  );
	protected $softDelete = true;
	protected static $unguarded = true;
    public static $snakeAttributes = false;
	
    // TODO: optimize
    public function updateStats2() {

        // take all the jobs for that worker
		
		// TODO: change to Job::
        if($crowdAgentJobs = Job::where('metrics.workers.withFilter.' . $this->_id, 'exists', true)->get(['_id'])) {
			
			//if there is at least one job with that worker
            if(count($crowdAgentJobs->toArray()) > 0) {   
                $spam = $nonspam = $totalNoOfWorkerunits = 0;
                foreach($this->workerunits as $a) {
                    $totalNoOfWorkerunits++;

                    if($a->spam) $spam++;
                    else $nonspam++;

                    $types[]= $a->type;
                    $jobids[] = $a->job_id;
                    $unitids[] = $a->unit_id;
       
                }
 
               // $this->WorkerunitStats = array('count'=>$total['count'], 'spam'=>$spam, 'nonspam'=>$nonspam);
                $distinctWorkerunitTypes = array_unique($types); // These actually are the Workerunit types
                $workerParticipatedIn = count(array_unique($unitids));
				dd($workerParticipatedIn);

                $cache["workerunits"] = [
                        "count" => $totalNoOfWorkerunits,
                        "spam" => $spam,
                        "nonspam" => $nonspam];


                // take all distinct batches
                $distinctBatchIds = Entity::whereIn('_id', array_flatten($crowdAgentJobs->toArray()))->distinct('batch_id')->get(['_id']);

				/*

               
                
                foreach($distinctBatchIds as $distinctBatchId) {
                    $batchParents = array_flatten(Entity::where('_id', '=', $distinctBatchId[0])->lists('parents'));
                    //print_r($batchParents[0]);
                    $batchParentsType = Entity::where('_id', '=', $batchParents[0])->distinct('documentType')->get(['documentType']);
                    //print_r(array_flatten($batchParentsType->toArray())[0]);
                    if(isset($cache["mediaTypes"]["types"][array_flatten($batchParentsType->toArray())[0]])) {
                        $cache["mediaTypes"]["types"][array_flatten($batchParentsType->toArray())[0]] = $cache["mediaTypes"][array_flatten($batchParentsType->toArray())[0]] + 1;
                    }
                    else {
                        $cache["mediaTypes"]["types"] = [];
                        $cache["mediaTypes"]["types"][array_flatten($batchParentsType->toArray())[0]] = 1;
                    }
                }
                $cache["mediaTypes"]["distinct"] = sizeof(array_keys($cache["mediaTypes"]["types"]));
                */


                if(count($distinctWorkerunitTypes) > 0) {
                    $cache["jobTypes"] = [
                        "distinct" => count($distinctWorkerunitTypes),
                        "count" => count(array_unique($jobids)),
                        "types" => []
                    ];
                    foreach($distinctWorkerunitTypes as $distinctJobType) {
                        $distinctJobTypeCount = Job::whereIn('_id', array_flatten($crowdAgentJobs->toArray()))->type($distinctJobType)->count();
                        
                        $distinctJobTemplateTypes = Job::whereIn('_id', array_flatten($crowdAgentJobs->toArray()))->type($distinctJobType)->distinct('template')->get()->toArray();
                        $countJobTemplateTypes = Job::whereIn('_id', array_flatten($crowdAgentJobs->toArray()))->type($distinctJobType)->count();
                        //$cache["jobTypes"]["types"][$distinctJobType[0]] = [];
                        $cache["jobTypes"]["types"][$distinctJobType]['distinct'] = count($distinctJobTemplateTypes);
                        $cache["jobTypes"]["types"][$distinctJobType]['count'] = count($countJobTemplateTypes);
                        $cache["jobTypes"]["types"][$distinctJobType]["templates"] = [];
                        foreach($distinctJobTemplateTypes as $distinctJobTemplateType) {
                        
                            $distinctJobTemplateAndCount = Job::whereIn('_id', array_flatten($crowdAgentJobs->toArray()))->where('template', $distinctJobTemplateType)->count();
                            
                            $cache["jobTypes"]["types"][$distinctJobType]["templates"][$distinctJobTemplateType[0]] = $distinctJobTemplateAndCount;
                        }
                    }   
                }
				
                $jobsAsSpammer = Job::whereIn('_id', array_flatten($crowdAgentJobs->toArray()))->whereIn('metrics.spammers.list', [$this->_id])->lists('platformJobId');
                $cache["spammer"]["count"] = count($jobsAsSpammer);
                $cache["spammer"]["jobs"] = array_flatten($jobsAsSpammer);

                $this->cache = $cache;
                $this->save();        
                     
            }
            else {
                $this->save();
            }
        }

  
    }


/*

    public function updateStats(){
    	$countthese = array('type', 'domain', 'format');
    	$stats = array();

    	// Workerunits
    	$total = array('count' => count($this->workerunits));
        $spam = $nonspam = 0;
    	foreach($this->workerunits as $a){
    		foreach($countthese as $x){
    			if(isset($total[$x][$a->$x])) $total[$x][$a->$x]++;
    			else $total[$x][$a->$x] = 1;
    		}

            if($a->spam) $spam++;
            else $nonspam++;

    		$jobids[] = $a->job_id;
    		$unitids[] = $a->unit_id;
    	}

    	$this->workerunitStats = array('count'=>$total['count'], 'spam'=>$spam, 'nonspam'=>$nonspam);

        if(isset($jobids)){
        	// Jobs
        	$total = array('count' => count(array_unique($jobids)));
        	foreach(array_unique($jobids) as $jobid){
                if($a = \Job::id($jobid)->first()){
            		foreach($countthese as $x){
            			if(isset($total[$x][$a->$x])) $total[$x][$a->$x]++;
            			else $total[$x][$a->$x] = 1;
            		}
                }
        	}
        	//$this->jobTypes = array('distinct' => $total;
		}

    	// Units
        if(isset($unitids)){
        	$countthese = array_diff($countthese, array('type')); // UNITs have no type, so remove this from the array.
        	$total = array('count' => count(array_unique($unitids)));
        	foreach(array_unique($unitids) as $unitid){
        		if($a = Entity::id($unitid)->first()){
            		foreach($countthese as $x){
            			if(isset($total[$x][$a->$x])) $total[$x][$a->$x]++;
            			else $total[$x][$a->$x] = 1;
            		}
                }
        	}
        	$this->unitCount = $total;
        }
        
    	$this->save();
    }
*/

	// TODO: Can be removed.
	public function hasGeneratedWorkerunits(){
		return $this->hasMany('Entity', 'crowdAgent_id', '_id');
	}

	public function workerunits(){
		return $this->hasMany('\Entities\Workerunit', 'crowdAgent_id', '_id');
	}


	public function scopeId($query, $id)
    {
        return $query->where_id($id);
    }

	public static function createCrowdAgent($softwareAgent_id, $platformWorkerId, $additionalData = array()){
		// TODO
	}

    /**
    * @throws Exception
    */
    public function flag(){
        if($this->flagged)
            throw new Exception('CrowdAgent was flagged already.');

        $this->flagged = true;
        $this->save();
    }

    /**
    * @throws Exception
    */
    public function unFlag(){
        if(!$this->flagged)
            throw new Exception('CrowdAgent is not flagged.');
        
        $this->flagged = false;
        $this->save();
    }

    /**
    * @param string $message The message to the CrowdAgent (IE why we blocked him)
    * @throws Exception
    */
    public function block($message){
        if($this->blocked)
            throw new Exception('Worker is already blocked.');

        $platformid = $this->softwareAgent_id;
        $platform = App::make($platformid);
        $platform->blockWorker($this->platformWorkerId, $message);
        $this->blocked = true;
    }

    /**
    * @param string $message The message to the CrowdAgent (IE why we unblocked him)
    * @throws Exception
    */
    public function unblock($message){
        if(!$this->blocked)
            throw new Exception('Worker is not blocked.');

        $platformid = $this->softwareAgent_id;
        $platform = App::make($platformid);
        $platform->unblockWorker($this->platformWorkerId, $message);
        $this->blocked = true;
    }



    public function recievedMessage($subject, $message){
        $messagesRecieved = $this->messagesRecieved;
        
        $messagesRecieved['count']++;
        array_push($messagesRecieved['messages'], array('subject'=>$subject, 'message'=>$message));
        
        $this->messagesRecieved = $messagesRecieved;
        $this->save();
    }
}