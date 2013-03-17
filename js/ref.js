var listtemplate = '<li><a href="http://api.lassoref.com/lasso9/LassoReferenceApi/get.xhr?id={id}{ttm}" class="dlink"><h2>{name}</h2><p>{desc}</p></a></li>';
var datatemplate = '<h3>[ {objname} ]</h3><div class="datatype">{datatype}</div><div class="desc">{desc}</div>';
var syntaxtempate = '<section class="syntax"><h4>Syntax</h4><div><code>{syntax}</code></div></section>';

var rapp = {};
rapp.init = function() {
    rapp.cache();
	rapp.bindlisteners();
	rapp.loadqueries();
};

rapp.cache = function() {
     rapp.dom = {};
     rapp.dom.cat = '';
     rapp.dom.home = '';
     rapp.dom.queries = [];
     
     // cat cache
     rapp.cat = {};
     rapp.cat.id = [];
     rapp.cat.name = [];
     rapp.cat.results = [];
     
     // query cache
     rapp.query = {};
     rapp.query.terms = [];
     rapp.query.results = [];
};
rapp.bindlisteners = function() {
	$(document).on('submit',function(event){
		if($('.APISearch').val() !== '') { rapp.dosearch($('.APISearch').val()); }  
		event.preventDefault();
		return false;
	});
	$('.catlinks').on( "click", function( event ){
		event.preventDefault();
		rapp.dataurl = $(this).attr("href");
		rapp.docats();  
		$('#left-panel').panel('close');
	});
	$(document).on('click','#backtocat',function(event){
		event.preventDefault();
		rapp.popuatecat();
	});
	$(document).on('click','#gohome',function(event){
		event.preventDefault();
		rapp.popuatehome();
	});
	$(document).on( "click",'.dlink', function( event ){
		event.preventDefault();
		rapp.dataurl = $(this).attr("href");
		rapp.dodetail();
	});
	$(document).on('blur','#APISearch',function(){
		if($(this).val() !== '') { rapp.dosearch($(this).val()); }  
	});
	$(document).on('click','.rqueries',function(){
		event.preventDefault();
		rapp.dosearch($(this).attr('rel'));  
	});
};
rapp.docats = function(){
    if(rapp.dom.home.length === 0) { rapp.dom.home = $('#apicontent').html() };
	$.mobile.loading( 'show', {
        text: 'Loading',
        textVisible: true,
        textonly: false
    });
	if (rapp.dataurl !== null) {
		if(rapp.cat.id.indexOf(rapp.dataurl) > -1) {
//			console.log(rapp.dataurl+' - cat cache hit');
			// get from cache		
			var result = rapp.cat.results[rapp.cat.id.indexOf(rapp.dataurl)];
			var newhtml = rapp.catHTML(rapp.cat.name[rapp.cat.id.indexOf(rapp.dataurl)],result);
			$.mobile.loading( 'hide' );
			rapp.dom.cat = newhtml;
			$('#apicontent').html(newhtml);
			$('#categories').trigger('pagecreate');
			$("ul").listview('refresh');
		} else {
			$.ajax({
				url:        'http://api.lassoref.com/lasso9/LassoReferenceApi/categories/search.xhr?q='+rapp.dataurl,
				async:      true,
				type:       'get',
				dataType:   'jsonp',
				success:    function(data) {
//					console.log(rapp.dataurl+' - cat cache miss');
					rapp.cat.id.push(rapp.dataurl);
					rapp.cat.name.push(data.cat);
					rapp.cat.results.push(data.results);

					var newhtml = rapp.catHTML(data.cat,data.results);
					rapp.dom.cat = newhtml;
					$.mobile.loading( 'hide' );
					rapp.popuatecat();
				}
			});
		}
	} else if(rapp.dom.cat.length > 0) {
		rapp.popuatecat();
	}
	$.mobile.silentScroll(0);
};
rapp.dosearch = function(q){
    if(rapp.dom.home.length === 0) { rapp.dom.home = $('#apicontent').html() };
	$.mobile.loading( 'show', {
        text: 'Loading',
        textVisible: true,
        textonly: false
    });
	rapp.dataurl = 'http://api.lassoref.com/lasso9/LassoReferenceApi/search.xhr?q='+q;
	var result;
//	console.log(q);
	if(rapp.query.terms.indexOf(q) > -1) {
//		console.log(q+' - cache hit');
		// get from cache		
		result = rapp.query.results[rapp.query.terms.indexOf(q)];
		var newhtml = rapp.listHTML(q,result);
		$.mobile.loading( 'hide' );
		rapp.dom.cat = newhtml;
		$('#apicontent').html(newhtml);
		$('#categories').trigger('pagecreate');
		$("ul").listview('refresh');
	} else {
		// get from server
		$.ajax({
			url:        rapp.dataurl,
			async:      true,
			type:       'get',
			dataType:   'jsonp',
			success:    function(data) {
//				console.log(q+' - cache miss');
				rapp.query.terms.push(q);
				rapp.query.results.push(data.results);
				rapp.dom.queries = data.queries;
				
				var newhtml = rapp.listHTML(q,data.results);
				$.mobile.loading( 'hide' );
				rapp.dom.cat = newhtml;
				$('#apicontent').html(rapp.dom.cat);
				$('#categories').trigger('pagecreate');
				$("ul").listview('refresh');
			}
		});
	}
	$.mobile.silentScroll(0);
};
rapp.catHTML = function(cat,results){
    if(rapp.dom.home.length === 0) { rapp.dom.home = $('#apicontent').html() };
	var newhtml = '<h3>Category: '+cat+'</h3>'; 
	newhtml += '<ul data-role="listview" data-inset="true">';
	for(var i = 0; i < results.length; i++) {
		var node = results[i];
		var newnode = listtemplate;
		newnode = newnode.replace(/{id}/g,node.id);
		if(node.datatype === 'tt') {
			newnode = newnode.replace(/{ttm}/g,'&datatype=tt');
		} else {
			newnode = newnode.replace(/{ttm}/g,'');
		}
		newnode = newnode.replace(/{name}/g,node.fullname);
		newnode = newnode.replace(/{desc}/g,node.description);
		newhtml += newnode;
	}
	newhtml += '</ul>';

	return newhtml;
};
rapp.listHTML = function(q,results){
    if(rapp.dom.home.length === 0) { rapp.dom.home = $('#apicontent').html() };
	var newhtml = '<h3>Search Results: "'+q+'"</h3>'; 
	if(results.length > 0) {
		newhtml += '<ul data-role="listview" data-inset="true">';
		for(var i = 0; i < results.length; i++) {
			var node = results[i];
			var newnode = listtemplate;
			newnode = newnode.replace(/{id}/g,node.id);
			if(node.datatype === 'tt') {
				newnode = newnode.replace(/{ttm}/g,'&datatype=tt');
			} else {
				newnode = newnode.replace(/{ttm}/g,'');
			}
			newnode = newnode.replace(/{name}/g,node.fullname);
			newnode = newnode.replace(/{desc}/g,node.description);
			newhtml += newnode;
		}
		newhtml += '</ul>';		
	} else {
		newhtml += '<p>No results</p>';
	}
	return newhtml;
};
rapp.popuatecat = function(){
	$('#apicontent').html(rapp.dom.cat);
	$('#categories').trigger('pagecreate');
	$("ul").listview('refresh');
};
rapp.popuatehome = function(){
    if(rapp.dom.home.length > 0) { $('#apicontent').html(rapp.dom.home) };
    if(rapp.dom.queries.length > 0) {
    	$('.queryli').remove();
		for(var i = 0; i < rapp.dom.queries.length; i++) {
			var node = rapp.dom.queries[i];
			$('.queries').append('<li class="queryli"><a rel="'+node+'" href="#" class="rqueries">'+node+'</a></li>')
		};
	};
	rapp.dom.queries = [];
	$('#categories').trigger('pagecreate');
	$(".queries").listview('refresh');
};
rapp.loadqueries = function(){
	$.ajax({
		url:        'http://api.lassoref.com/lasso9/LassoReferenceApi/queries.xhr',
		async:      true,
		type:       'get',
		dataType:   'jsonp',
		success:    function(data) {
			if(data.queries.length === 0) {
				$('.queries').append('<li class="queryli">You have no recent queries</li>'); 
				$("ul").listview('refresh');
			}
			else {
				rapp.dom.queries = data.queries;
				rapp.popuatehome();
			}
		}
	});
};
rapp.dodetail = function(){
    if(rapp.dom.home.length === 0) { rapp.dom.home = $('#apicontent').html() };
	$.mobile.loading( 'show', {
        text: 'Loading',
        textVisible: true,
        textonly: false
    });
	if(rapp.dataurl !== null) {
		$.ajax({
			url:        rapp.dataurl,
			async:      true,
			type:       'get',
			dataType:   'jsonp',
			success:    function(data) {
				var node = data;
				var newhtml = '';
				var newnode = datatemplate;
				newnode = newnode.replace(/{objname}/g,node.fullname);
				newnode = newnode.replace(/{datatype}/g,node.datatypeext);
				if(node.syntax.length > 0){
					newnode = newnode.replace(/{desc}/g,node.description);
				} else {
					newnode = newnode.replace(/{desc}/g,'<p>No description provided.</p>');
				}
				if(node.syntax.length > 0){
					newnode += syntaxtempate;
					newnode = newnode.replace(/{syntax}/g,node.syntax);
				}
				if(node.examples.length > 0){
					newnode += '<section class="example"><h4>Examples</h4>';
					for(var e = 0; e < node.examples.length; e++) {
						var ex = node.examples[e];
						newnode += '<div>';
						if(ex.body.length) { newnode += ex.body };
						if(ex.code.length) { newnode += '<p><i>Code</i></p><code>'+ex.code+'</code>' };
						if(ex.result.length) { newnode += '<p><i>Result</i></p><code>'+ex.result+'</code>' };
						newnode += '</div></section>';
					}
				}
				if(node.memberMethods.length > 0){
					newnode += '<section class="memberMethods"><h4>Member Methods</h4><div>';
					for(var e = 0; e < node.memberMethods.length; e++) {
						newnode += node.memberMethods[e]+'<br>';
					}
					newnode += '</div></section>';
				}
				if(node.traits.length > 0){
					newnode += '<section class="traits"><h4>Traits</h4><div>';
					for(var e = 0; e < node.traits.length; e++) {
						newnode += node.traits[e]+'<br>';
					}
					newnode += '</div></section>';
				}
				if(node.articles.length > 0){
					newnode += '<section class="articles"><h4>Articles</h4>';
					for(var e = 0; e < node.articles.length; e++) {
						var ex = node.articles[e];
						newnode += '<div>';
						if(ex.description.length) { newnode += ex.description };
						if(ex.href.length) { newnode += '<br><a href="'+ex.href+'" target="_blank>'+ex.href+'</a>' };
						newnode += '</div>';
					}
					newnode += '</section>';
				}
				if(node.tips.length > 0){
					newnode += '<section class="tips"><h4>Tips</h4><div>';
					for(var e = 0; e < node.tips.length; e++) {
						newnode += node.tips[e]+'<br>';
					}
					newnode += '</div></section>';
				}

				newhtml += newnode;
				newhtml += '<div><a id="backtocat" data-inline="true" data-role="button" href="/" data-icon="back" data-iconpos="left">Back</a></div>';
				$('#apicontent').html(newhtml);
				$.mobile.loading( 'hide' );
				$('#categories').trigger('pagecreate');
			}
		});
	}
	$.mobile.silentScroll(0);
};

$(document).ready(function() {
	rapp.init();
});