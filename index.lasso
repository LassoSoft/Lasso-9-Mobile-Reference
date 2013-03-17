<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Lasso 9 Reference</title>
[/*

<link rel="apple-touch-icon-precomposed" sizes="144x144" href="/touch/apple-touch-icon-144x144-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="/touch/apple-touch-icon-114x114-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="72x72" href="/touch/apple-touch-icon-72x72-precomposed.png">
<link rel="apple-touch-icon-precomposed" href="/touch/apple-touch-icon-57x57-precomposed.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
*/]
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<link rel="stylesheet"  href="/css/jquery.mobile-1.3.0.css">
	<link rel="stylesheet"  href="/css/ref.min.css">
[
/*
	<link rel="stylesheet"  href="/css/ref.css">
	<link rel="stylesheet"  href="/css/ref.all.min.css">
	
	
	<script src="/js/jquery-1.9.1.min.js"></script>
	<script src="/js/jquery.mobile-1.3.0.min.js"></script>
	<script src="/js/ref.js"></script>
*/
]
	<script src="/build/ref.min.js"></script>
	<!-- iPhone SPLASHSCREEN-->
<link href="/startup/startup.png" media="(device-width: 320px)" rel="apple-touch-startup-image">
<!-- iPhone (Retina) SPLASHSCREEN-->
<link href="/startup/startup-retina.png" media="(device-width: 320px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image">
<!-- iPad (portrait) SPLASHSCREEN-->
<link href="/startup/startup-tablet-portrait.png" media="(device-width: 768px) and (orientation: portrait)" rel="apple-touch-startup-image">
<!-- iPad (landscape) SPLASHSCREEN-->
<link href="/startup/startup-tablet-landscape.png" media="(device-width: 768px) and (orientation: landscape)" rel="apple-touch-startup-image">
<!-- iPad (Retina, portrait) SPLASHSCREEN-->
<link href="/startup/startup-tablet-portrait-retina.png" media="(device-width: 1536px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image">
<!-- iPad (Retina, landscape) SPLASHSCREEN-->
<link href="/startup/startup-tablet-landscape-retina.png" media="(device-width: 2056px)  and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image">

<!-- Tile icon for Win8 (144x144 + tile color) -->
<meta name="msapplication-TileImage" content="_static/img/touch/apple-touch-icon-144x144-precomposed.png">
<meta name="msapplication-TileColor" content="#000000">
[
if(not lasso_methodexists('lasso9cats')) => {	
	define lasso9cats => json_deserialize(curl('http://api.lassoref.com/lasso9/LassoReferenceApi/categories/list.xhr')->asString)->find('categories')
}
]
</head>
<body>
	<div data-role="page" id="categories" data-theme="d">
		<div data-theme="a" data-role="header" data-position="fixed">
			<h3><span class="rhino"></span>
				Lasso 9 Ref
			</h3>
			<a href="#left-panel" data-icon="bars" data-iconpos="notext" data-shadow="false" data-iconshadow="false">Menu</a>
			<a href="#" id="gohome" data-icon="home" data-iconpos="notext" data-shadow="false" data-iconshadow="false">Home</a>
		</div>
		<div data-role="panel" id="left-panel" data-theme="c">
			<ul data-role="listview" data-theme="d">
				<li data-icon="delete"><a href="#" data-rel="close">Close</a></li>
				<li data-icon="home"><a href="http://www.lassosoft.com" target="_blank">LassoSoft Site</a></li>
				<li data-icon="info"><a href="http://api.lassoref.com/lasso9/LassoReferenceApi/docs" target="_blank">API Reference</a></li>
			</ul>
		<div data-role="collapsible" data-inset="false" data-iconpos="right" data-theme="b" data-content-theme="d">
			<h3>Categories</h3>
			<ul data-role="listview">
				[with c in lasso9cats do => {^]<li><a href="[#c->find('id')]" class="catlinks">[#c->find('name')] <span class="ui-li-count">[#c->find('counter')]</span></a></li>[^}]
			</ul>
		</div><!-- /collapsible -->
	</div><!-- /panel -->
	<div data-role="content">
		<div data-role="fieldcontain" id="APISearch">
			<form action="?" method="POST" id="APISearchForm" data-ajax="false">
			<fieldset data-role="controlgroup">
				<input name="APISearch" id="APISearch" class="APISearch" placeholder="Search Lasso 9 Reference" value="" type="search">
				<div style="display:none;">
				<input type="submit" class="search_submit" value="go">
			</div>
			</fieldset>
			</form>
		</div>
		<div id="loader" class="icon-loading" style="display: none;"></div>
		<div id="apicontent">
			<ul class="queries" data-role="listview" data-inset="true" data-divider-theme="d">
				<li data-role="list-divider">Recent Queries</li>
			</ul>
		</div>
	</div>
</body>
</html>