/*
 * This file is part of a ThemeForest template ("PIXELLE") by James Padolsey
 *  - It is not free.
 *  - You may not distribute it.
 *  Please take care when making changes
 */

/* Some settings for you to change if you want: */

var slideshowSettings = {
    
        /* Name of slideshow, it's best if you leave this as it is: */
        slideshowID: 'slideshow',
        
        /* Timeout before a slide changes to the next: */
        timeout: 5000,
        
        /* Type of transition: */
        transition: 'fade', // Change to one of 'fade','scrollHorz','scrollVert','cover' etc.
        
        /* Trnasition Speed - Time between slide changes: */
        transitionSpeed: 1200,
        
        /* Show slide title: */
        showTitle: true,
        
        /* Show slide description: */
        showDescription: true
        
    },
    gallerySettings = {
        
        /* Height of thumbnails (Must all be the same height): */
        thumbImageHeight: 100,
        
        /* Background color of thumbnails (will not be seen unless you change opacity): */
        thumbBGColor: '#333',
        
        /* Styles to be applied to INACTIVE thumbnails: */
        inactiveThumbStyles : {
            opacity: 0.6  
        },
        
        /* Styles to be applied to ACTIVE thumbnails: */
        activeThumbStyles: {
            opacity: 1
        },
        
        /* Show slide title: */
        showTitle: true,
        
        /* Show slide description: */
        showDescription: true
        
    };

/* // END OF SETTINGS */

/* BE VERY CAREFUL FROM HERE ONWARDS! */

var pixelle = {
    
    init : function() {
        /* Attach JS StyleSheet */
        this.attachStylesheet('style/main.js.css');
        this.slideshow.init();
        this.gallery.init();
    },
    
    slideshow : {
        
        settings: this.settings,
        
        init: function(){
            this.attachSlideshowControls();
            this.prepareSlideshow();
        },
        attachSlideshowControls : function() {
            $('#' + slideshowSettings.slideshowID)
                .append('<div style="height:350px;" />')
                    .find('> li').hide()
                    .find('img').each(function(){
                        var slideShowItem = $(this).parent().get(0).nodeName.toLowerCase()==='a' ? $(this).parent() : this;
                        $(slideShowItem).appendTo('#' + slideshowSettings.slideshowID + ' > div');
                    });
            $('#' + slideshowSettings.slideshowID)
                .append('<a href="#" id="' + slideshowSettings.slideshowID + '-next">NEXT</a><a href="#" id="' + slideshowSettings.slideshowID + '-last">LAST</a>' + (slideshowSettings.showTitle||slideshowSettings.showDescription ? ('<div id="' + slideshowSettings.slideshowID + '-description"><div>' + (slideshowSettings.showTitle ? '<h3/>' : '') + (slideshowSettings.showDescription ? '<p/>' : '') + '</div></div>') : ''))
                .find('> li').hide();
        },
        
        prepareSlideshow : function() {
            function onAfter(curr, next, opts) {
                /* Set description text */
                var title = $(next).attr('alt') ? $(next).attr('alt') : $('img:eq(0)',next).attr('alt'),
                    description = $('#' + slideshowSettings.slideshowID + ' li:eq(' + opts.currSlide + ') p:eq(0)').text();
                    
                if(title&&title!=='') {$('#' + slideshowSettings.slideshowID + '-description h3').html(title);}
                if(description&&description!=='') {$('#' + slideshowSettings.slideshowID + '-description p').html(description);}
                
                /* SlideUp === Sliding -DOWN- */
                $('#' + slideshowSettings.slideshowID + '-description').slideDown();
            }
            
            function onBefore(curr, next, opts) {
                $('#' + slideshowSettings.slideshowID + '-description').slideUp();
            }
            
            /* Apply CYCLE plugin */
            $('#' + slideshowSettings.slideshowID + ' > div:eq(0)').cycle({ 
                fx: slideshowSettings.transition || 'fade',
                timeout: slideshowSettings.timeout || 4000,
                prev: '#' + slideshowSettings.slideshowID + '-last', 
                next: '#' + slideshowSettings.slideshowID + '-next',
                after: onAfter,
                before: onBefore,
                speed: slideshowSettings.transitionSpeed || 1000
            });
        }
        
    },
    
    gallery : {
        
        init: function() {
            var gallery = this;
            $(window).load(function(){
                gallery.prepareGallery();
            });
        },
        
        prepareGallery: function(){
            
            var $gallery = $('#gallery'),
                contentWidth = $('#content').width(),
                widerThanContent = true,
                /* clickCount records number of clicks - back/forth/specific of gallery */
                clickCount = 0;
            
            if(!$gallery.get(0)) {return;}
            
            /* If slideshow DIV does not already exist: */
            if(!$('#' + slideshowSettings.slideshowID).get(0)) {
                $('<div/>').attr({
                    id : slideshowSettings.slideshowID
                }).append('<a href="#" id="' + slideshowSettings.slideshowID + '-next">NEXT</a><a href="#" id="' + slideshowSettings.slideshowID + '-last">LAST</a>' + (gallerySettings.showTitle||gallerySettings.showDescription ? ('<div id="' + slideshowSettings.slideshowID + '-description"><div>' + (gallerySettings.showTitle ? '<h3/>' : '') + (gallerySettings.showDescription ? '<p/>' : '') + '</div></div>') : ''))
                .insertBefore('#content-wrapper');
            }
            
            var slideshow = $('#' + slideshowSettings.slideshowID);
            
            /* Prepare Carousel : */
            $gallery.css({
                height: '110px',
                overflow: 'hidden',
                width: (function(){
                            var width = 0;
                            $('li',$gallery).each(function(){
                                /* While we're in the loop, we might as well get some stuff done: */
                                $(this).css({
                                    width: 'auto',
                                    backgroundColor: gallerySettings.thumbBGColor,
                                    height: gallerySettings.thumbImageHeight||100
                                }); $('p',this).hide();
                                width += ( $(this).width() + parseInt($(this).css('borderLeftWidth').replace('px',''),10) + parseInt($(this).css('borderRightWidth').replace('px',''),10) + parseInt($(this).css('marginLeft').replace('px',''),10) + parseInt($(this).css('marginLeft').replace('px',''),10) );
                            });
                            if(width<contentWidth) {widerThanContent = false;}
                            return width;
                        })() + 'px'
            }).wrap('<div id="gallery-wrap"/>');
            
            if(widerThanContent) {
                $('<a href="#" id="carousel-back">BACK</a>')
                    .click(function(){
                        $('#gallery-wrap').stop().animate({scrollLeft:'-=400px'},900);
                        return false;
                    }).prependTo('#content');
                
                $('<a href="#" id="carousel-forward">FORWARD</a>')
                    .click(function(){
                        $('#gallery-wrap').stop().animate({scrollLeft:'+=400px'},900);
                        return false;
                    }).appendTo('#content');
                
                /* Getting IE6 to behave: */
                $('#gallery-wrap').css({
                    width: contentWidth-90  + 'px'
                });                
            }
            
            /* Insert NEW 'big' images into SS, and attach events: */
            $('li > a',$gallery).each(function(i){
                $('<img src="' + $(this).attr('href') + '" />')
                    .load(function(){
                        $(this).data('loaded',true);
                    })
                    .appendTo(slideshow);
                $(this).click((function(i){
                    return function() {
                        $(slideshow).cycle(i);
                        return false;
                    };
                })(i)).find('img').css(gallerySettings.inactiveThumbStyles);
            });
            
            function applyThumbStyle(i) {
                /* Reset all : */
                $('li > a img',$gallery).css(gallerySettings.inactiveThumbStyles);
                /* Set specific : i : */
                $('li > a:eq(' + i + ') img',$gallery).css(gallerySettings.activeThumbStyles);
            }
            
            function onBefore(curr, next, opts) {
                var height = $(next).height();
                $(next).css({
                    width: $(next).width(),
                    left: '50%',
                    marginLeft: '-' + ($(next).width()/2) + 'px',
                    height: height
                }).animate({
                    top: '30px'
                });
                $(slideshow).animate({
                    height: (height+60) + 'px'
                });
                /* Apply active styles to active thumbnail */
                applyThumbStyle(clickCount===0 ? 0 : opts.nextSlide);
                /* Slide the description panel down (NB. Down===Up) (INVISIBLE) : */
                if(opts.currSlide!==opts.nextSlide) {
                    $('#' + slideshowSettings.slideshowID + '-description').slideUp();
                }
                
                /* Scroll selected to center (IF POSSIBLE) : */
                var nextSlide = $('li:eq(' + (clickCount===0 ? 0 : opts.nextSlide) + ')',$gallery),
                    offsetLeft = $('li:eq(0)',$gallery).offset().left - nextSlide.offset().left;
                offsetLeft = parseInt((offsetLeft).toString().replace('-',''),10)-(422-(nextSlide.width()/2));
                $('#gallery-wrap').stop().animate({scrollLeft: offsetLeft + 'px'},900);
                
                clickCount++;
            }
            
            function onAfter(curr, next, opts) {
                var title = $('li:eq(' + opts.currSlide + ') img:eq(0)',$gallery).attr('alt'),
                    description = $('li:eq(' + opts.currSlide + ') p:eq(0)',$gallery).html();
                if(title&&title!=='') {
                    $('#' + slideshowSettings.slideshowID + '-description')
                        .find('h3').html(title);
                }
                if(description&&description!=='') {
                    $('#' + slideshowSettings.slideshowID + '-description')
                        .find('p').html(description);
                }
                /* Slide the description panel UP (NB. Down===Up) (VISIBLE) : */
                $('#' + slideshowSettings.slideshowID + '-description').slideDown();
            }
            
            function showLoader() {
                $('<div id="gallery-loader"><div><strong>PLEASE WAIT, IMAGES ARE LOADING. (<span>0 of _</span> so far)</strong></div></div>').appendTo(slideshow);
            }
            
            function updateLoader(loaded,all) {
                $('#gallery-loader span').html(loaded + ' of ' + all);
            }
            
            function hideLoader() {
                $('#gallery-loader').fadeOut(function(){$(this).remove();});
            }
            
            function checkIfImagesAreLoaded() {
                var images = $('img',slideshow),
                    loadedImages = 0;
                showLoader();
                function check() {
                    $(images).each(function(i){
                        /* If not loaded */
                        //alert($(this).height())
                        if($(this).data('loaded')===true) {
                            loadedImages++;
                        }
                    });
                    if(loadedImages===images.length) {
                        hideLoader();
                        beginSlideshow();
                    } else {
                        updateLoader(loadedImages,images.length);
                        loadedImages=0;
                        setTimeout(function(){check();},400);
                    }
                }
                check();
            }
            
            function beginSlideshow() {
                /* DON'T CHANGE THESE UNLESS YOU KNOW WHAT YOU'RE DOING! */
                $(slideshow).cycle({
                    slideExpr: 'img',
                    /* Be especially careful if changing FX : */
                    fx: 'fade',
                    timeout: 0,
                    prev: '#' + slideshowSettings.slideshowID + '-last', 
                    next: '#' + slideshowSettings.slideshowID + '-next',
                    after: onAfter,
                    before: onBefore,
                    /* Speed of transition - (Between slides) : */
                    speed: gallerySettings.transitionSpeed
                });
            }
            
            checkIfImagesAreLoaded();
            
        }
    },
    
    attachStylesheet : function (href) {
        return $('<link href="' + href + '" rel="stylesheet" type="text/css" />').insertAfter('title');  
    }
};

$(function(){
    /* DO NOT REMOVE THIS!!! */
    pixelle.init();
});