<!-- START relex/breadcrumb -->
<ol class="breadcrumb">
	<!-- <li{{ (Request::is('preprocess/relex/info') ? ' class="active"' : '') }}>{{ link_to('preprocess/relex/info', "Info") }}</li> -->
	<li{{ (Request::is('media/preprocess/relex/*') ? ' class="active"' : '') }}>{{ link_to('media/preprocess/relex/actions', "Relex") }}</li>
	
	@if(Request::is('media/preprocess/relex/preview'))
	<li class='active'>
		{{ link_to('media/preprocess/relex/preview?URI=' . $entity['_id'], "Preview: " . $entity['title']) }}
	</li>
	@endif
</ol>
<!-- END relex/breadcrumb   -->