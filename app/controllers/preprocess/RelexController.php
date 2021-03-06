<?php

namespace preprocess;

use \preprocess\RelexStructurer as RelexStructurer;
use BaseController, Cart, View, App, Input, Redirect, Session;

class RelexController extends BaseController {
//RelexController
	protected $repository;
	protected $relexStructurer;

	public function __construct(Repository $repository, RelexStructurer $relexStructurer)
	{
		$this->repository = $repository;
		$this->relexStructurer = $relexStructurer;
	}

	public function getIndex()
	{
		return Redirect::to('media/preprocess/relex/actions');
	}

	public function getInfo()
	{
		return View::make('media.preprocess.relex.pages.info');
	}

	public function getActions()
	{
		// get all uploaded documents
		// TODO: change to select by actual type
		$entities = Entity::where('activity_id', 'LIKE', '%fileuploader%')->get();

		if(count($entities) > 0)
		{
			return View::make('media.preprocess.relex.pages.actions', compact('entities'));
		}

		return Redirect::to('media/upload')->with('flashNotice', 'You have not uploaded any documents yet');
	}

	public function getPreview()
	{
		if($URI = Input::get('URI'))
		{
			if($entity = $this->repository->find($URI)) {
				if($entity->documentType != "relex")
				{
					continue;
				}

				$document = $this->relexStructurer->process($entity, true);
				// print_r($document);
				// exit;
				return View::make('media.preprocess.relex.pages.view', array('entity' => $entity, 'lines' => $document));
			}
		} 
		else 
		{
			return Redirect::back()->with('flashError', 'No valid URI given: ' . $URI);
		}	
	}

	public function getProcess()
	{
		if($URI = Input::get('URI'))
		{
			if($entity = $this->repository->find($URI)) {
				if($entity->documentType != "relex")
				{
					continue;
				}

				$entity = $entity->toArray();

				return $status_processing = $this->relexStructurer->process($entity);
			}
		} 
		else 
		{
			return Redirect::back()->with('flashError', 'No valid URI given: ' . $URI);
		}	
	}

}