//TWITTER PLUGIN
(function( $ ) {
    $.fn.wt_twitter = function(options) {
        var linkify = function(text){
            text = text.replace(/(https?:\/\/\S+)/gi, function (s) {
                return '<a class="wt_twitter_post_link_external" href="' + s + '">' + s + '</a>';
            });
            text = text.replace(/(^|)@(\w+)/gi, function (s) {
                return '<a class="wt_twitter_post_link_user" href="http://twitter.com/' + s + '">' + s + '</a>';
            });
            text = text.replace(/(^|)#(\w+)/gi, function (s) {
                return '<a class="wt_twitter_post_link_search" href="http://search.twitter.com/search?q=' + s.replace(/#/,'%23') + '">' + s + '</a>';
            });
            return text;
        };
        return this.each(function(){
			var settings = $.extend( {
				user : '',
				posts: 5,
				loading: 'Loading tweets..'
			}, options);
            var t = $(this);
            if(t.attr('data-user'))
                settings.user = t.attr('data-user');
            if(t.attr('data-posts'))
                settings.posts = parseInt(t.attr('data-posts'));
            if(t.attr('data-loading'))
                settings.loading = t.attr('data-loading');
            if(settings.user.length && (typeof settings.posts === 'number' || settings.posts instanceof Number) && settings.posts>0){
                t.addClass('wt_twitter');
                if(settings.loading.length)
                    t.html('<div class="wt_twitter_loading">'+settings.loading+'</div>');
                $.getJSON("http://api.twitter.com/1/statuses/user_timeline/"+settings.user+".json?callback=?", function(t_tweets){
                    t.empty();
                    for(var i=0;i<settings.posts&&i<t_tweets.length;i++){
                        var t_date_str;
                        var t_date_seconds = Math.floor(((new Date()).getTime()-Date.parse(t_tweets[i].created_at))/1000);
                        var t_date_minutes = Math.floor(t_date_seconds/60);
                        if(t_date_minutes){
                            var t_date_hours = Math.floor(t_date_minutes/60);
                            if(t_date_hours){
                                var t_date_days = Math.floor(t_date_hours/24);
                                if(t_date_days){
                                    var t_date_weeks = Math.floor(t_date_days/7);
                                    if(t_date_weeks)
                                        t_date_str = 'About '+t_date_weeks+' week'+(1==t_date_weeks?'':'s')+' ago';
                                    else
                                        t_date_str = 'About '+t_date_days+' day'+(1==t_date_days?'':'s')+' ago';
                                }else
                                    t_date_str = 'About '+t_date_hours+' hour'+(1==t_date_hours?'':'s')+' ago';
                            }else
                                t_date_str = 'About '+t_date_minutes+' minute'+(1==t_date_minutes?'':'s')+' ago';
                        }else
                            t_date_str = 'About '+t_date_seconds+' second'+(1==t_date_seconds?'':'s')+' ago';
                        var t_message =
                            '<div class="wt_twitter_post'+(i+1==t_tweets.length?' last"':'"')+'>'+
                                linkify(t_tweets[i].text)+
                                '<span class="wt_twitter_post_date">'+
                                    t_date_str+
                                '</span>'+
                            '</div>';
                        t.append(t_message);
                    }
                });
            }
       });
    };
})( jQuery );

//PORTOFOLIO PLUGIN
(function( $ ){
    $.fn.categorized = function( settings, options ) {
        for(var i=0;i<options.length;i++){
            options[i] = $.extend({
                resolution: 0,   //mandatory
                columns: 0,   //mandatory
                itemMarginRight: 0,
                itemMarginBottom: 0,
                containerPaddingTop: 0,
                containerPaddingBottom: 0,
                containerPaddingLeft: 0,
                containerPaddingRight: 0,
                itemHeight: 0   //mandatory
            }, options[i]);
			if(options[i].containerWidth===undefined)
				options[i].containerWidth = options[i].resolution;
		}
        settings = $.extend({
            itemClass: '',   //mandatory
            time: 0,   //mandatory
            allCategory: '',   //mandatory
            categoryAttribute: 'data-categories'
        }, settings);
        var t = this.get(0);
        var t_container = $(t);
        var t_items = t_container.children('.'+settings.itemClass);
        var t_items_length = t_items.length;
        var t_items_categorized = [];
        var t_category_all = settings.allCategory;
        var t_category;
        if(settings.initialCategory!==undefined)
            t_category = settings.initialCategory;
        else
            t_category = t_category_all;
        var t_category_previous = t_category_all;
        var t_index = -1;
        var x_categorize = function(){
            for(var i=0;i<t_items_length;i++){
                var x_current = t_items.filter(':eq('+i+')');
                t_items_categorized.push({
                    item: x_current,
                    categories: x_current.attr(settings.categoryAttribute).replace(/^\s+/,'').replace(/\s+$/,'').replace(/\s+/g,' ').toLowerCase().split(' ')
                });
            };
        };
        x_categorize();
        var x_sortResolutions = function(){
            for(var i=0;i<options.length-1;i++){
                var i_max = i;
                for(var j=i+1;j<options.length;j++)
                    if(options[j].resolution>options[i_max].resolution){
                        i_max = j;
                    }
                if(i_max>i){
                    var temp = options[i];
                    options[i] = options[i_max];
                    options[i_max] = temp;
                }
            }
        };
        x_sortResolutions();
        var x_arrangeItems = function(){
            t_container.width(options[t_index].containerWidth);
            var x_width = Math.floor((options[t_index].containerWidth-options[t_index].containerPaddingLeft-options[t_index].containerPaddingRight-(options[t_index].columns-1)*options[t_index].itemMarginRight)/options[t_index].columns);
            var x_height = t_items.height();
            x_height = options[t_index].itemHeight;
            var x_index = 0;
            for(var i=0;i<t_items_length;i++){
                if(-1!==t_items_categorized[i].categories.indexOf(t_category)||t_category===t_category_all){
                    if(-1!==t_items_categorized[i].categories.indexOf(t_category_previous)||t_category_previous===t_category_all){
                        t_items_categorized[i].item.stop().css({overflow:'visible'}).animate({
                            top: options[t_index].containerPaddingTop+Math.floor(x_index/options[t_index].columns)*(x_height+options[t_index].itemMarginBottom),
                            left: options[t_index].containerPaddingLeft+(x_index%options[t_index].columns)*(x_width+options[t_index].itemMarginRight)
                        },{duration:settings.time,queue:false,easing:'linear'});
                    }else{
                        t_items_categorized[i].item.stop().css({overflow:'visible'}).css({
                            top: options[t_index].containerPaddingTop+Math.floor(x_index/options[t_index].columns)*(x_height+options[t_index].itemMarginBottom),
                            left: options[t_index].containerPaddingLeft+(x_index%options[t_index].columns)*(x_width+options[t_index].itemMarginRight),
                            marginLeft: (1===options[t_index].columns?0:x_width/2),
                            marginTop: x_height/2
                        });
                    }
                    t_items_categorized[i].item.animate({
                        opacity: 1,
                        width: x_width,
                        height: x_height,
                        marginLeft: 0,
                        marginTop: 0
                    },{duration:settings.time,queue:false,easing:'linear'});
                    x_index++;
                }else{
                    if(-1!==t_items_categorized[i].categories.indexOf(t_category_previous)||t_category_previous===t_category_all){
                        t_items_categorized[i].item.stop().css({overflow:'visible'}).animate({
                            opacity: 0,
                            width: (1===options[t_index].columns?x_width:0),
                            height: 0,
                            marginLeft: (1===options[t_index].columns?0:x_width/2),
                            marginTop: x_height/2
                        },{duration:settings.time,queue:false,easing:'linear'});
                    }
                }
            }
            t_container.stop().css({overflow:'visible'}).animate({height:options[t_index].containerPaddingTop+options[t_index].containerPaddingBottom+(x_index?(Math.ceil(x_index/options[t_index].columns)-1)*(x_height+options[t_index].itemMarginBottom)+x_height:0)},{duration:settings.time,queue:false,easing:'linear'});
        };
        var x_arrangeItemsResponsive = function(){
            t_container.width(options[t_index].containerWidth);
            var x_width = Math.floor((options[t_index].containerWidth-options[t_index].containerPaddingLeft-options[t_index].containerPaddingRight-(options[t_index].columns-1)*options[t_index].itemMarginRight)/options[t_index].columns);
            var x_height = options[t_index].itemHeight;
            var x_index = 0;
            for(var i=0;i<t_items_length;i++){
                if(!(-1===t_items_categorized[i].categories.indexOf(t_category))||t_category===t_category_all){
                    t_items_categorized[i].item.stop().css({overflow:'visible'}).css({
                        top: options[t_index].containerPaddingTop+Math.floor(x_index/options[t_index].columns)*(x_height+options[t_index].itemMarginBottom),
                        left: options[t_index].containerPaddingLeft+(x_index%options[t_index].columns)*(x_width+options[t_index].itemMarginRight),
                        opacity: 1,
                        width: x_width,
                        height: x_height,
                        marginLeft: 0,
                        marginTop: 0
                    });
                    x_index++;
                }else
                    t_items_categorized[i].item.stop().css({overflow:'visible'}).css({
                        top: options[t_index].containerPaddingTop+Math.floor(i/options[t_index].columns)*(x_height+options[t_index].itemMarginBottom),
                        left: options[t_index].containerPaddingLeft+(i%options[t_index].columns)*(x_width+options[t_index].itemMarginRight),
                        opacity: 0,
                        width: 0,
                        height: 0,
                        marginLeft: x_width/2,
                        marginTop: x_height/2
                    });
            }
            t_container.stop().css({overflow:'visible'}).css({height:options[t_index].containerPaddingTop+options[t_index].containerPaddingBottom+(x_index?(Math.ceil(x_index/options[t_index].columns)-1)*(x_height+options[t_index].itemMarginBottom)+x_height:0)});
        };
        t.changeCategory = function(category){
            if(category!==t_category){
                t_category_previous = t_category;
                t_category = category;
                x_arrangeItems();
            }
        };
        var t_window = $(window);
        var x_resize = function(){
            var w_width = t_window.width();
            var t_index_temp = 0;
            while(w_width<options[t_index_temp].resolution&&t_index_temp<options.length-1)
                t_index_temp++;
            if(t_index_temp!==t_index){
                t_index = t_index_temp;
                x_arrangeItemsResponsive();
            }
        };
        t_window.resize(x_resize);
        x_resize();
        t.destroyCategorizedObject = function(){
            t_window.unbind('resize',x_resize);
            delete t.changeCategory;
        };
        return t;
    };
})( jQuery );



//LOAD MODULES
var t_browser_has_css3;
var t_css3_array = ['transition','-webkit-transition','-moz-transition','-o-transition','-ms-transition'];
var t_css3_index;
$(document).ready(function(){
    var t_css3_test = $('body');
    for(t_css3_index=0, t_css3_test.css(t_css3_array[t_css3_index],'');t_css3_index<t_css3_array.length&&null==t_css3_test.css(t_css3_array[t_css3_index]);t_css3_test.css(t_css3_array[++t_css3_index],''));
    if(t_css3_index<t_css3_array.length)
        t_browser_has_css3 = true;
    else
        t_browser_has_css3 = false;
    load_photostream();
    load_main_slider();
    load_tooltips();
    load_carousel();
    load_contact();
	load_portofolio();
});







/* ================= SCROOL TOP ================= */
$(document).ready(function () {
    $('#footer_arrow a').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 1200, 'swing');
        return false;
    });
}); 



/* ================= PORTFOLIO HOVER EFFECTS ================= */
$(function(){
	var t_time = 300;
	$(".hover_effect").hover(function(){
		$(this).stop().animate({opacity:1},{queue:false,duration:t_time,easing:'linear'});
		$(this).find(".image_zoom img").stop().animate({marginTop:0},{queue:false,duration:t_time,easing:'linear'});
		$(this).find(".porto_title").stop().animate({marginLeft:'0%'},{queue:false,duration:t_time,easing:'linear'});
		$(this).find(".porto_type").stop().animate({marginLeft:'0%'},{queue:false,duration:t_time,easing:'linear'});
	},function(){
		$(this).stop().animate({opacity:0},{queue:false,duration:t_time,easing:'linear'});
		$(this).find(".image_zoom img").stop().animate({marginTop:-80},{queue:false,duration:t_time,easing:'linear'});
		$(this).find(".porto_title").stop().animate({marginLeft:'-100%'},{queue:false,duration:t_time,easing:'linear'});
		$(this).find(".porto_type").stop().animate({marginLeft:'100%'},{queue:false,duration:t_time,easing:'linear'});
	});
});



/* ================= SLIDE CONTENT EFFECTS ================= */
$(function(){
	var t_time = 300;
	$(".slide_image_hover").hover(function(){
		$(this).stop().animate({opacity:1},{queue:false,duration:t_time,easing:'linear'});
		$(this).find(".slide_image_zoom").stop().animate({marginLeft:-48},{queue:false,duration:t_time,easing:'linear'});
		$(this).find(".slide_image_link").stop().animate({marginLeft:3},{queue:false,duration:t_time,easing:'linear'});
	},function(){
		$(this).stop().animate({opacity:0},{queue:false,duration:t_time,easing:'linear'});
		$(this).find(".slide_image_zoom").stop().animate({marginLeft:'-100%'},{queue:false,duration:t_time,easing:'linear'});
		$(this).find(".slide_image_link").stop().animate({marginLeft:'100%'},{queue:false,duration:t_time,easing:'linear'});
	});
});



/* ================= KEYBORD ================= */
$(document).ready(function () {
	$(".keybord_mini img").click(function(){
		$(".keybord").css("display","block");
	});
	$(".keybord").click(function(){
		$(".keybord").css("display","none");
	});
});



/* ================= TOOL TIP ================= */
$(document).ready(function () {
	$('.tool_title').tooltip();
}); 



/* ================= PRETTY PHOTO ================= */
$(document).ready(function(){
    $("a[data-rel^='prettyPhoto']").prettyPhoto();
  });



/* ================= TWITTER ================= */

$(document).ready(function(){
	$('.twitter').wt_twitter();
});


/* ================= PHOTOSTREAM ================= */
var load_photostream = function(){
    $('.Photostream').each(function(){
        var stream = $(this);
        var stream_userid = stream.attr('data-userid');
        var stream_items = parseInt(stream.attr('data-items'));
        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&format=json&id="+stream_userid+"&jsoncallback=?", function(stream_feed){
            for(var i=0;i<stream_items&&i<stream_feed.items.length;i++){
                var stream_function = function(){
                    if(stream_feed.items[i].media.m){
                        var stream_a = $('<a>').addClass('PhotostreamLink').attr('href',stream_feed.items[i].link).attr('target','_blank');
                        var stream_img = $('<img>').addClass('PhotostreamImage').attr('src',stream_feed.items[i].media.m).attr('alt','').load(function(){
                            var t_loaded_function = function(){
                                stream_a.append(stream_img);
                                if(stream_img.width()<stream_img.height())
                                    stream_img.attr('style','width: 100% !important; height: auto !important;');
                                else
                                    stream_img.attr('style','width: auto !important; height: 100% !important;');
                            };
                            var t_loaded_ready = false;
                            var t_loaded_check = function(){
                                if(!t_loaded_ready){
                                    t_loaded_ready = true;
                                    t_loaded_function();
                                }
                            }
                            var t_loaded_status = function(){
                                if(this.complete)
                                    t_loaded_check();
                            }
                            t_loaded_status();
                            $(this).load(function(){
                                t_loaded_check();
                            });
                        });
                        stream.append(stream_a);
                    }
                }
                stream_function();
            }
        });
    });
};



/* ================= IE fix ================= */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) {return i;}
        }
        return -1;
    }
}



/* ================= COLLAPSE ================= */
$(function(){
	var t_accordion = $('#accordion2');
	var t_active_class = 'accordion-heading-active';
	t_accordion.find('.collapse.in').parents('.accordion-group').find('.accordion-heading').addClass(t_active_class);
	t_accordion.find('.accordion-group').on('show', function () {
		$(this).find('.accordion-heading').addClass(t_active_class);
	});
	t_accordion.find('.accordion-group').on('hide', function () {
		$(this).find('.accordion-heading').removeClass(t_active_class);
	});
});



//MAIN SLIDER
var load_main_slider = function(){
    $('.rs_mainslider').each(function(){
        var t_time = 1000;   //time for transition animation
        var t_interval_time = 4000;   //time for slide change, must be equal or bigger then effect transition time;
        var t_resume_time = 10000;   //time to resume autoplay after a click
        var t_hover_time = 200;   //time for hover eefect
        var t_text_time = 500;   //time for text animation
        var t = $(this);
        var t_prev = t.find('.rs_mainslider_left');
        var t_next = t.find('.rs_mainslider_right');
        var t_items_container = t.find('ul.rs_mainslider_items');
        var t_items = t_items_container.find('li');
        var t_dots_container = t.find('.rs_mainslider_dots_container ul.rs_mainslider_dots');
        var t_dots;
        var t_items_active_class = 'rs_mainslider_items_active';
        var t_items_active_selector = '.'+t_items_active_class;
        var t_dots_active_class = 'rs_mainslider_dots_active';
        var t_dots_active_selector = '.'+t_dots_active_class;
        var t_index = 0;
        var t_index_max = t_items.length-1;
        var t_select_fix = function(){
            return false;
        };
        var t_interval = 0;
        var t_timeout = 0;
        var t_autoplay_start = function(){
            return;
            t_interval = setInterval(t_next_function,t_interval_time);
        };
        var t_autoplay_stop = function(){
            return;
            clearInterval(t_interval);
            clearTimeout(t_timeout);
            t_timeout = setTimeout(t_autoplay_start,t_resume_time);
        };
        var t_text = t.find('ul.rs_mainslider_items li .rs_mainslider_items_text');
        var t_text_top = t_text.css('top');
        var t_text_last;
        var t_next_function = function(){
            var t_text_old = t_text.filter(':eq('+t_index+')');
            t_index++;
            if(t_index>t_index_max)
                t_index = 0;
            var t_text_current = t_text.filter(':eq('+t_index+')');
            if(t_text_last!==undefined)
                t_text_last.stop(true).css({top:-t_text_last.height()});
            t_text_last = t_text_old;
            t_text_old.stop(true).animate({top:'100%'},{queue:false,duration:t_text_time,easing:'easeInBack',complete:function(){
                t_text_current.stop(true).animate({top:t_text_top},{queue:false,duration:t_text_time,times:1,easing:'easeOutBack'});
            }});
            t_items_container.css({height:t_items.filter(t_items_active_selector).outerHeight(true)});
            t_items.filter(t_items_active_selector).removeClass(t_items_active_class).children('.rs_mainslider_items_image').stop(true).animate({opacity:0},{queue:false,duration:t_time,easing:'swing'});
            t_dots.filter(t_dots_active_selector).removeClass(t_dots_active_class);
            t_items.filter(':eq('+t_index+')').addClass(t_items_active_class).children('.rs_mainslider_items_image').stop(true).animate({opacity:1},{queue:false,duration:t_time,easing:'swing'});
            t_dots.filter(':eq('+t_index+')').addClass(t_dots_active_class);
            t_items_container.css({height:'auto'});
        };
        var t_items_count = t_items.length;
        t_text.each(function(i){
            $(this).css({top:'-100%'});
        });
        t_items.each(function(){
            var x = $(this);
            var x_img = x.children('.rs_mainslider_items_image');
            var x_text = x.children('.rs_mainslider_items_text');
            var t_loaded_function = function(){
                x_text.css({top:-$(this).height()});
                t_items_count--;
                if(t_items_count===0){
                    t_text.filter(':eq('+t_index+')').stop(true).animate({top:t_text_top},{queue:false,duration:t_text_time,easing:'easeOutBack'});
                    for(i=0;i<=t_index_max;i++)
                        t_dots_container.append('<li'+(t_index===i?' class="'+t_dots_active_class+'"':'')+'></li>');
                    t_dots = t_dots_container.children('li');
                    t_items.filter(':eq('+t_index+')').addClass(t_items_active_class).children('.rs_mainslider_items_image').stop(true).animate({opacity:1},{queue:false,duration:t_time,easing:'swing'});
                    t_dots.filter(':eq('+t_index+')').addClass(t_dots_active_class);
                    t_prev.click(function(){
                        var t_text_old = t_text.filter(':eq('+t_index+')');
                        t_index--;
                        if(t_index<0)
                            t_index = t_index_max;
                        var t_text_current = t_text.filter(':eq('+t_index+')');
                        if(t_text_last!==undefined)
                            t_text_last.stop(true).css({top:-t_text_last.height()});
                        t_text_last = t_text_old;
                        t_text_old.stop(true).css({top:t_text_top}).animate({top:'100%'},{queue:false,duration:t_text_time,easing:'easeInBack',complete:function(){
                            t_text_current.stop(true).animate({top:t_text_top},{queue:false,duration:t_text_time,times:1,easing:'easeOutBack'});
                        }});
                        t_items_container.css({height:t_items.filter(t_items_active_selector).outerHeight(true)});
                        t_items.filter(t_items_active_selector).removeClass(t_items_active_class).children('.rs_mainslider_items_image').stop(true).animate({opacity:0},{queue:false,duration:t_time,easing:'swing'});
                        t_dots.filter(t_dots_active_selector).removeClass(t_dots_active_class);
                        t_items.filter(':eq('+t_index+')').addClass(t_items_active_class).children('.rs_mainslider_items_image').stop(true).animate({opacity:1},{queue:false,duration:t_time,easing:'swing'});
                        t_dots.filter(':eq('+t_index+')').addClass(t_dots_active_class);
                        t_items_container.css({height:'auto'});
                        t_autoplay_stop();
                    });
                    t_next.click(function(){
                        t_next_function();
                        t_autoplay_stop();
                    });
                    t_dots.click(function(){
                        var t_dots_current = t_dots.filter(t_dots_active_selector).not(this);
                        if(t_dots_current.length){
                            var t_text_old = t_text.filter(':eq('+t_index+')');
                            t_index = t_dots.index(this);
                            var t_text_current = t_text.filter(':eq('+t_index+')');
                            if(t_text_last!==undefined)
                                t_text_last.stop(true).css({top:-t_text_last.height()});
                            t_text_last = t_text_old;
                            t_text_old.stop(true).css({top:t_text_top}).animate({top:'100%'},{queue:false,duration:t_text_time,easing:'easeInBack',complete:function(){
                                t_text_current.stop(true).animate({top:t_text_top},{queue:false,duration:t_text_time,times:1,easing:'easeOutBack'});
                            }});
                            t_items_container.css({height:t_items.filter(t_items_active_selector).outerHeight(true)});
                            t_items.filter(t_items_active_selector).removeClass(t_items_active_class).children('.rs_mainslider_items_image').stop(true).animate({opacity:0},{queue:false,duration:t_time,easing:'swing'});
                            t_dots_current.filter(t_dots_active_selector).removeClass(t_dots_active_class);
                            t_items.filter(':eq('+t_index+')').addClass(t_items_active_class).children('.rs_mainslider_items_image').stop(true).animate({opacity:1},{queue:false,duration:t_time,easing:'swing'});
                            t_dots.filter(':eq('+t_index+')').addClass(t_dots_active_class);
                            t_items_container.css({height:'auto'});
                        }
                        t_autoplay_stop();
                    });
                    t.hover(function(){
                        t_prev.stop(true).animate({opacity:1},{queue:false,duration:t_hover_time,easing:'linear'});
                        t_next.stop(true).animate({opacity:1},{queue:false,duration:t_hover_time,easing:'linear'});
                    },function(){
                        t_prev.stop(true).animate({opacity:0},{queue:false,duration:t_hover_time,easing:'linear'});
                        t_next.stop(true).animate({opacity:0},{queue:false,duration:t_hover_time,easing:'linear'});
                    });
                    t_prev.mousedown(t_select_fix);
                    t_next.mousedown(t_select_fix);
                    t_dots.mousedown(t_select_fix);
                    t_autoplay_start();
                }
            };
            var t_loaded_ready = false;
            if(x_img[0].complete){
                t_loaded_ready = true;
                t_loaded_function();
            }else
                x_img.load(function(){
                    t_loaded_function();
                });
        });
    });
};


//TOOLTIPS
var load_tooltips = function(){
    var t_hints_close_time = 500;   //time for hint fade effect
    var t_scroll_time = 300;   //time for scrolling to hint
    var t_hints_expires_minutes = 5;   //minutes after which the cookie will expirev
    var t_hint_cookie = 'agat_tooltips';
    var t_hints = $('.hints');
    var t_hints_n = t_hints.length;
    if(t_hints_n){
        var t_index  = $.cookie(t_hint_cookie);
        if(null===t_index)
            t_index = '1';
        if('-1'!==t_index){
            var t_html = $('html,body');
            var t_window = $(window);
            t_hints.filter('[data-index='+t_index+']').css({visibility:'visible'}).animate({opacity:1},{queue:false,duration:t_hints_close_time,easing:'swing'});
            t_hints.each(function(){
                var t = $(this);
                var t_next = t.find('.hint_next');
                var t_close = t.find('.hint_close');
                t_close.click(function(){
                    t.animate({opacity:0},{queue:false,duration:t_hints_close_time,easing:'swing',complete:function(){t.css({visibility:'hidden'})}});
                    var t_date = new Date();
                    t_date.setMinutes(t_date.getMinutes()+t_hints_expires_minutes);
                    $.cookie(t_hint_cookie,-1,{expires: t_date});
                    return false;
                });
                t_next.click(function(){
                    var t_date = new Date();
                    t_date.setMinutes(t_date.getMinutes()+t_hints_expires_minutes);
                    t.animate({opacity:0},{queue:false,duration:t_hints_close_time,easing:'swing',complete:function(){t.css({visibility:'hidden'})}});
                    t_index = t_hints.filter('[data-index='+t_index+']').attr('data-next');
                    if('-1'!==t_index){
                        $.cookie(t_hint_cookie,t_index,{expires: t_date/*, path: '/' */});
                    }else{
                        $.cookie(t_hint_cookie,-1,{expires: t_date});
                    }
                    var t_href = t_next.attr('href');
                    if(null===t_href||'#'===t_href[0]){
                        if('-1'!==t_index){
                            var t_current = t_hints.filter('[data-index='+t_index+']');
                            var t_current_position = t_current.offset();
                            t_html.animate({scrollTop:Math.min(t_html.height()-t_window.height(),Math.max(0,t_current_position.top-t_window.height()/2))},{queue:false,duration:t_scroll_time,easing:'swing'});
                            t_current.css({visibility:'visible'}).animate({opacity:1},{queue:false,duration:t_hints_close_time,easing:'swing'});
                        }
                        return false;
                    }else
                        return true;
                });
            });
        }
    }
};



//CAROUSEL
var load_carousel = function(){
    $('.slide_content').each(function(){
        var t_time = 500;   //time for animation effect
        var t = $(this);
        var t_scroll_width = $.browser.mozilla||$.browser.opera?scrollbarWidth():0;
        console.log('t_scroll_width='+t_scroll_width);
        var t_prev = t.prev('.center_title').find('.slide_nav_back');
        var t_next = t.prev('.center_title').find('.slide_nav_next');
        var t_items = t.find('.slide_content_full>div').not('.clear');
        var t_items_n = t_items.length;
        var t_items_container_visible_width;
        var t_items_width;
        var t_visible;
        var t_index;
        var t_index_max;
        var t_prev_function;
        var t_next_function;
        var t_pre_process_specific;
        var t_pre_process = function(){
            t_items.attr('style','overflow:hidden; padding:5px 0px;');
            t_index = 0;
            t_items_container_visible_width = t.find('.slide_content_show').width();
            t_items_width = t_items.outerWidth(true);
            t_visible = Math.round(t_items_container_visible_width/t_items_width);
            t_index_max = t_items.length-Math.min(t_items.length,t_visible);
            t_pre_process_specific();
        };
        var t_img = t.find('img');
        var t_img_n = t_img.length;
        var t_img_loaded = function(){
            t_prev.click(function(){
                t_prev_function();
            });
            t_next.click(function(){
                t_next_function();
            });
            var t_w = $(window);
            var t_w_x = -1;
            var t_d = $(document);
            var t_w_width_get = function(){
                var t_w_width = t_w.width();
                var t_w_height = t_w.height();
                var t_d_height = t_d.height();
                if(t_w_height<t_d_height)
                    t_w_width += t_scroll_width;
                return t_w_width;
            };
            var t_w_resize_function = function(){
                var t_w_width = t_w_width_get();
                if( t_w_width>=768){
                    if(t_w_x!==1){
                        t_w_x = 1;
                        
                        t_pre_process_specific = function(){
                            if(t_index_max)
                                t_items.filter(':gt('+String(t_visible-1)+')').each(function(){
                                    var t_items_hidden = $(this);
                                    t_items_hidden.css({marginTop:t_items_hidden.height()/2}).css({display:'none'});
                                });
                        };
                        t_pre_process();
                        t_prev_function = function(){
                            if(t_index>0){
                                t_index--;
                                var t_items_current = t_items.filter(':eq('+t_index+')');
                                t_items_current.stop(true,true).animate({width:'toggle',marginLeft:'toggle',marginTop:0,height:'toggle'},{queue:false,duration:t_time,easing:'swing'});
                                var t_index_opposite = t_index+t_visible;
                                var t_items_copposite = t_items.filter(':eq('+t_index_opposite+')');
                                t_items_copposite.stop(true,true).animate({width:'toggle',marginLeft:'toggle',marginTop:t_items_copposite.height()/2,height:'toggle'},{queue:false,duration:t_time,easing:'swing'});
                            }
                        };
                        t_next_function = function(){
                            if(t_index<t_index_max){
                                var t_index_opposite = t_index+t_visible;
                                var t_items_copposite = t_items.filter(':eq('+t_index_opposite+')');
                                t_items_copposite.stop(true,true).animate({width:'toggle',marginLeft:'toggle',marginTop:0,height:'toggle'},{queue:false,duration:t_time,easing:'swing'});
                                var t_items_current = t_items.filter(':eq('+t_index+')');
                                t_items_current.stop(true,true).animate({width:'toggle',marginLeft:'toggle',marginTop:t_items_current.height()/2,height:'toggle'},{queue:false,duration:t_time,easing:'swing'});
                                t_index++;
                            }
                        };
                    }
                }else{
                    if( t_w_x!==2 ){
                        t_w_x = 2;
                        
                        t_pre_process_specific = function(){
                            t_visible = 1;
                            t_index_max = t_items_n-1;
                            if(t_index_max)
                                t_items.filter(':gt('+String(t_visible-1)+')').css({display:'none'});
                        };
                        t_pre_process();
                        t_prev_function = function(){
                            if(t_index>0){
                                t_items.filter(':eq('+t_index+')').css({display:'none'});
                                t_index--;
                                t_items.filter(':eq('+t_index+')').css({display:'block'});
                            }
                        };
                        t_next_function = function(){
                            if(t_index<t_index_max){
                                t_items.filter(':eq('+t_index+')').css({display:'none'});
                                t_index++;
                                t_items.filter(':eq('+t_index+')').css({display:'block'});
                            }
                        };
                    }
                }
            };
            t_w.resize(t_w_resize_function);
            t_w_resize_function();
        };
        var t_img_ready = [];
        var t_img_ready_complete = false;
        var t_img_ready_all = function(){
            var i = 0;
            for(i=0;i<t_img_n&&(t_img_ready[i]===1||t_img[i].complete);i++);
            return i===t_img_n;
        };
        var t_img_ready_check = function(){
            var t_img_ready_complete_temp = t_img_ready_all();
            if(!t_img_ready_complete&&t_img_ready_complete_temp){
                t_img_ready_complete = t_img_ready_complete_temp;
                t_img_loaded();
            }
        };
        t_img.each(function(index){
            t_img_ready[index] = 0;
        });
        t_img.load(function(index){
            t_img_ready[index] = 1;
            t_img_ready_check();
        });
        t_img_ready_check();
        t_prev.mousedown(function(){return false;});
        t_next.mousedown(function(){return false;});
    });
};

//CONTACTS
var load_contact = function(){
    $('#contact_page_form').each(function(){
        var t = $(this);
        var t_result = $('#contact_page_form_result');
        var validate_email = function validateEmail(email) { 
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };
        t.submit(function(event) {
            event.preventDefault();
            var t_values = {};
            var t_values_items = t.find('input[name],textarea[name]');
            t_values_items.each(function() {
                t_values[this.name] = $(this).val();
            });
            if(t_values['name']===''||t_values['email']===''||t_values['message']===''){
                t_result.html('Please fill in all the required fields.');
            }else
                if(!validate_email(t_values['email']))
                    t_result.html('Please provide a valid e-mail.');
                else
                    $.post("php/contacts.php", t.serialize(),function(result){
                        t_result.html(result);
                    });
        });
		
    });
}




// ========================== PORTO-FILTERS ========================== //
var load_portofolio = function(){
    $('.porto_filter').each(function(){
        var t = $(this);
        var t_filters = t.children('.porto_filterFilter').children('.center').children('ul.porto_filterFilterCategories').children('li');
        var t_filters_active_class = 'porto_filter_active';
        var t_filters_active_selector = '.'+t_filters_active_class;
        var t_views = t.children('.porto_filterViews').children('.porto_filterViewsOption');
        var t_views_active_class = 'worksViewsOptionActive';
        var t_views_active_selector = '.'+t_views_active_class;
        var t_container = t.children('.porto_filterContainer');
        var t_categorized_object;
        var t_settings1 = {
            itemClass: 'porto_box',
            time: 400,
            allCategory: 'all'
        };
        var t_options1 = [
            {
                resolution: 980,
                columns: 4,
                itemHeight: 161,
				itemMarginRight: 20,
				itemMarginBottom: 20,
				containerWidth: 940
            },
            {
                resolution: 768,
                columns: 3,
                itemHeight: 167,
				itemMarginRight: 20,
				itemMarginBottom: 20,
				containerWidth: 724
            },
            {
                resolution: 520,
                columns: 2,
                itemHeight: 168,
				itemMarginRight: 20,
				itemMarginBottom: 20,
				containerWidth: 480
            },
            {
                resolution: 300,
                columns: 1,
                itemHeight: 221,
				itemMarginBottom: 20
            }
        ];
        var t_settings2 = {
            itemClass: 'porto_box',
            time: 400,
            allCategory: 'all'
        };
        var t_options2 = [
            {
                resolution: 960,
                columns: 1,
                itemHeight: 215,
                itemMarginBottom: 35
            },
            {
                resolution: 768,
                columns: 1,
                itemHeight: 172,
                itemMarginBottom: 35
            },
            {
                resolution: 480,
                columns: 1,
                itemHeight: 107,
                itemMarginBottom: 35
            },
            {
                resolution: 300,
                columns: 1,
                itemHeight: 67,
                itemMarginBottom: 35
            }
        ];
        var t_parameters = [[t_settings1,t_options1],[t_settings2,t_options2]];
        
        
        t_filters.click(function(){
            var t_filters_last = t_filters.filter(t_filters_active_selector).not(this);
            if(t_filters_last.length){
                t_filters_last.removeClass(t_filters_active_class);
                var t_filters_current = $(this);
                t_filters_current.addClass(t_filters_active_class);
                t_categorized_object.changeCategory(t_filters_current.attr('data-category'));
            }
        });
        t_views.click(function(){
            var t_views_last = t_views.filter(t_views_active_selector).not(this);
            if(t_views_last.length){
                t_views_last.removeClass(t_views_active_class);
                t_container.removeClass(t_views_last.attr('data-class'));
                var t_views_current = $(this);
                t_views_current.addClass(t_views_active_class);
                t_container.addClass(t_views_current.attr('data-class'));
                t_categorized_object.destroyCategorizedObject();
                var x_index = t_views.index(this);
                t_parameters[x_index][0].initialCategory = t_filters.filter(t_filters_active_selector).attr('data-category');
                t_categorized_object = t_container.categorized(t_parameters[x_index][0],t_parameters[x_index][1]);
            }
        });
        t_categorized_object = t_container.categorized(t_parameters[0][0],t_parameters[0][1]);
    });
};
function scrollbarWidth() { 
    var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>'); 
    // Append our div, do our calculation and then remove it 
    $('body').append(div); 
    var w1 = $('div', div).innerWidth(); 
    div.css('overflow-y', 'scroll'); 
    var w2 = $('div', div).innerWidth(); 
    $(div).remove(); 
    return (w1 - w2); 
}
jQuery.getScrollBarSize = function() {
   var inner = $('<p></p>').css({
      'width':'100%',
      'height':'100%'
   });
   var outer = $('<div></div>').css({
      'position':'absolute',
      'width':'100px',
      'height':'100px',
      'top':'0',
      'left':'0',
      'visibility':'hidden',
      'overflow':'hidden'
   }).append(inner);
      
   $(document.body).append(outer);
         
   var w1 = inner.width(), h1 = inner.height();
   outer.css('overflow','scroll');
   var w2 = inner.width(), h2 = inner.height();
   if (w1 == w2 && outer[0].clientWidth) {
      w2 = outer[0].clientWidth;
   }
   if (h1 == h2 && outer[0].clientHeight) {
      h2 = outer[0].clientHeight;
   }
        
   outer.detach();
        
   return [(w1 - w2),(h1 - h2)];
};



