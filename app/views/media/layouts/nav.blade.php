<!-- START file_nav -->   
						<ul class="nav nav-tabs">
							<li{{ (Request::segment(2) == 'upload' ? ' class="active"' : '') }}>{{ link_to('media/upload', "Upload Media") }}</li>
							<!-- <li{{ (Request::segment(2) == 'browse' ? ' class="active"' : '') }}>{{ link_to('files/browse', "Browse Files") }}</li> -->
							<!-- <li{{ (Request::segment(2) == 'view' ? ' class="active"' : '') }}>{{ link_to('#', "&nbsp;View&nbsp;") }}</li> -->
					
							<li{{ (Request::segment(2) == 'facetedsearch' ? ' class="active"' : '') }}>{{ link_to('media/search', "Search Media") }}</li>
						</ul>
<!-- END file_nav   -->   