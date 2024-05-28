/*
Responsive table script

Credit to http://css-tricks.com/responsive-data-tables/
*/

!function($) {
    var className = 'lc_responsivetable',
        maxWindowWidth = 700,
        bodyElement = document.body,
        windowWidth = window.innerWidth,
        windowHeight = window.innerHeight,
        largeTables = document.getElementsByTagName('table'),
        largeImages = document.getElementsByClassName('ls_large-image'),
        //svgEquations = document.getElementsByTagName("svg"),
        equations = document.getElementsByTagName('math'),
        // or m:math??
        scalable = 1,
        smallDevice, supportsTouch;

    if (window.innerWidth > maxWindowWidth) {
        smallDevice = false;
    } else {
        smallDevice = true;
    }


    //Check if it's touch device


    function isTouchDevice() {
        supportsTouch = ('ontouchstart' in window) || !! (navigator.msMaxTouchPoints);
        return supportsTouch;
    }

    function zoomIn(event, target) {
        scalable = scalable + 0.2
        var imageId = target.getAttribute('data-target')
        var targetImage = document.getElementById(imageId)
        targetImage.style.transform = "scale(" + scalable + "," + scalable + ")"
        targetImage.style.transformOrigin = "0 0"
        targetImage.style.webkitTransform = "scale(" + scalable + "," + scalable + ")"
        targetImage.style.webkitTransformOrigin = "0 0"

    }

    function zoomOut(event, target) {
        scalable = scalable - 0.2
        if (scalable > 0.2) {
            var imageId = target.getAttribute('data-target')
            var targetImage = document.getElementById(imageId)
            targetImage.style.transform = "scale(" + scalable + "," + scalable + ")"
            targetImage.style.transformOrigin = "0 0"
            targetImage.style.webkitTransform = "scale(" + scalable + "," + scalable + ")"
            targetImage.style.webkitTransformOrigin = "0 0"
        }
    }

    function zoomReset(event, target) {
        scalable = 1
        var imageId = target.getAttribute('data-target')
        var targetImage = document.getElementById(imageId)
        targetImage.style.transform = "scale(" + scalable + "," + scalable + ")"
        targetImage.style.transformOrigin = "0 0"
        targetImage.style.webkitTransform = "scale(" + scalable + "," + scalable + ")"
        targetImage.style.webkitTransformOrigin = "0 0"

    }
    
    function setupEquations(){
        if (equations.length > 0) {
            var eqs = []
            if (equations.length > 0) {
                for (var key in equations) {
                    eqs.push(equations[key])
                }
            }
            /*if (svgEquations.length > 0) {
                for (var i = 0; i < svgEquations.length; i++) {
                    // check if it's really an equation or not
                    eqs.push(svgEquations[i])
                }
            }*/

            //set up the equations
            for (var i = 0; i < eqs.length; i++) {
                var equation = eqs[i],
                    width,
                    parentW = equation.parentNode ? equation.parentNode.offsetWidth : equation.offsetWidth

                if (equation.childNodes && equation.childNodes[0].length == 0) {
                    width = equation.offsetWidth
                } else {
                    width = equation.childNodes ? equation.childNodes[0].offsetWidth : equation.offsetWidth
                }

                if (equation.parentNode && equation.parentNode.className.indexOf("inlineequation") === -1 && equation.style && equation.style.display != "inline") {
                    // wrap it in a div for scaling purposes
                    var div = document.createElement('div')
                    div.wrap(equation)
                    div.setAttribute("style", "width: " + parentW + "px; overflow: visible;")
                    div.className = "lc_equationwrapper"
                    
                    if (width > parentW) {
                        // scale if it's bigger
                        scaleEquation(div, width, parentW)
                    }
                }
            }

        }
        
        if (window.MathJax != undefined) {
            MathJax.Hub.Queue(function() {
                var Equations = document.getElementsByClassName("MathJax_Display")
                for (var i = 0; i < Equations.length; i++) {
                    var equation = Equations[i]

                    if (equation.parentNode.className.indexOf("lc_equationwrapper") == -1 && equation.style.display != "inline") {
                        // oops, it's not wrapped for some reason... wrap it up, then continue
                        var div = document.createElement('div')
                        div.setAttribute("style", "width: " + equation.parentNode.offsetWidth + "px; overflow: visible;")
                        div.className = "lc_equationwrapper"
                        var newHTML = equation.parentNode.innerHTML,
                            parent = equation.parentNode
                            div.innerHTML = newHTML
                            parent.innerHTML = ""
                        parent.appendChild(div)
                        equation = div.childNodes[2]
                    }

                    var width = equation.childNodes[0].offsetWidth,
                        parentW = equation.parentNode.offsetWidth
                    if (width > parentW) {
                        scaleEquation(equation.parentNode, width, parentW)
                    }
                }
            });
        }
    }
    
    function resizeEquations(){
        // scale the equations here
        var equations = document.getElementsByClassName("lc_equationwrapper")

        if (equations.length > 0) {
            for (var i = 0; i < equations.length; i++) {
                var equation = equations[i],
                    width = equation.offsetWidth,
                    innerWidth = 0,
                    innerHeight = equation.offsetHeight,
                    screenWidth = equation.parentNode.offsetWidth

                    // get the inner width
                if (equation.childNodes[1] && equation.childNodes[1].className.indexOf("MathJax") != -1) {
                    if (equation.childNodes[1].childNodes[0]) {
                        innerWidth = equation.childNodes[1].childNodes[0].offsetWidth
                    } else {
                        innerWidth = equation.childNodes[2].childNodes[0].offsetWidth
                    }
                } else {
                    innerWidth = equation.childNodes[0].offsetWidth
                }

                if (innerWidth > screenWidth) {
                    scaleEquation(equation, innerWidth, screenWidth)
                } else {
                    equation.setAttribute("style", "width: " + screenWidth + "px; overflow: visible; margin: 0 auto;")
                    //equation.parentNode.setAttribute("style", "height: "+innerHeight+"px")
                }
            }
        }
    }

    function scaleEquation(equation, width, parentW) {
        // if this fires, the equation needs scaling
        var scaleRatio = parentW / width,
            height = equation.offsetHeight * scaleRatio

            equation.style.webkitTransform = "scale(" + scaleRatio + "," + scaleRatio + ")"
        equation.style.webkitTransformOrigin = "0 0"
        equation.style.mozTransform = "scale(" + scaleRatio + "," + scaleRatio + ")"
        equation.style.mozTransformOrigin = "0 0"
        equation.style.transform = "scale(" + scaleRatio + "," + scaleRatio + ")"
        equation.style.transformOrigin = "0 0"
        equation.style.width = width + "px"
        equation.style.maxWidth = width + "px"
        //equation.parentNode.style.height = height + "px"
    }
    
    function scaleIt(it){
        if(it.id != "highlightPopupContent"){
            // check for nested images, on tables
            var nestedImgs = it.getElementsByTagName('img')
            for (var j = 0; j < nestedImgs.length; j++) {
                var nestImage = nestedImgs[j]
                nestImage.style.maxWidth = "none"
            }
            
            // set the parent to have a style of "overflow:auto"
            it.parentNode.style.overflowY = "hidden"
            it.parentNode.style.overflowX = "auto"            
            it.style.webkitTransformOrigin = "0 0"
            it.style.mozTransformOrigin = "0 0"
            it.style.msTransformOrigin = "0 0"
            it.style.OTransformOrigin = "0 0"
            it.style.transformOrigin = "0 0"
            var parentW = it.parentNode.offsetWidth,
                itW = it.offsetWidth
            if(itW > parentW){
                // it's too big
                var ratio = parentW/itW                
                it.style.height = "auto"
                
                var height = it.offsetHeight,
                    parentHeight = it.parentNode.offsetHeight
                it.style.webkitTransform = "scale("+ratio+", "+ratio+")"
                it.style.mozTransform = "scale("+ratio+", "+ratio+")"
                it.style.msTransform = "scale("+ratio+", "+ratio+")"
                it.style.OTransform = "scale("+ratio+", "+ratio+")"
                it.style.transform = "scale("+ratio+", "+ratio+")"
                it.style.height = height*ratio+"px"
                it.parentNode.style.height = height*ratio +"px"
            } else {
                it.style.webkitTransform = ""
                it.style.mozTransform = ""
                it.style.msTransform = ""
                it.style.OTransform = ""
                it.style.transform = ""
                it.style.height = ""
                it.parentNode.style.height = ""
            }
        }
    }

   function init() {
       isTouchDevice()
        // bind the click events for the tables
        document.addEventListener("click", function(e) {
            var targetClasses = e.target.className,
                target

                // if it's fa, then bubble to parent
            if (targetClasses.indexOf("fa") != -1) {
                targetClasses = e.target.parentElement.className
                target = e.target.parentElement
            } else {
                target = e.target
            }

            if (targetClasses.indexOf("zoom") != -1) {
                targetClasses = targetClasses.replace("zoom-btn ", "")
                switch (targetClasses) {
                case "zoom-in":
                    zoomIn(e, target)
                    break
                case "zoom-out":
                    zoomOut(e, target)
                    break
                case "zoom-reset":
                    zoomReset(e, target)
                    break
                }
            }
        }, false)

        var selectedTable, otherEls, scaleRatio

        if (supportsTouch) {
            window.addEventListener("orientationchange", function() {
                if (largeTables.length > 0) {
                    for (var i = 0; i < largeTables.length; i++) {
                        selectedTable = largeTables[i]
                        scaleIt(selectedTable)
                    }
                }

                resizeEquations()
            });
        } else {
            var css = '.lc_imagewrapper {width:100%; overflow: auto; padding: 0 0 0 32px;} \
                       .zoom-buttons { position:absolute; left: 0; width: 25px; z-index:5; } \
                       .zoom-btn { -webkit-box-shadow: 0px 1px 3px rgba(0,0,0,0.4); box-shadow: 0px 1px 3px rgba(0,0,0,0.4);} \
                       .zoom-in, .zoom-in:hover, .zoom-out, .zoom-out:hover {display:block; font-size:18px; font-weight:bold; background:#fff; border:1px solid #000; color: #000; padding: 2px; line-height: 100%; width: 25px; border-radius: 0; -webkit-border-radius: 0;} \
                       .zoom-in, .zoom-in:hover {border-bottom: 0} \
                       .zoom-reset, .zoom-reset:hover {border:none; font-size: 12px; background: transparent; padding: 0; box-shadow: none; color: #08c; font-weight: normal; } ',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');
            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);

            for (var i = 0; i < largeImages.length; i++) {
                var selectedImage = largeImages[i]
                var randomId = Math.random().toString(36).substr(2);
                selectedImage.setAttribute("id", randomId);
                selectedImage.parentElement.setAttribute("style", "position: relative;")
                var div = document.createElement('div')
                div.setAttribute("class", "lc_imagewrapper")
                div.wrap(selectedImage)
                var div_control = ['<div class="zoom-buttons">', '<button data-target="' + randomId + '" class="zoom-btn zoom-in">+</button>', '<button data-target="' + randomId + '" class="zoom-btn zoom-out">-</button>', '<button class="zoom-btn zoom-reset" data-target="' + randomId + '" >Reset</button>', '</div>'].join('\n')

                div.insertAdjacentHTML('afterBegin', div_control)
            }
        }

        if (largeTables.length > 0) {
            for (var i = 0; i < largeTables.length; i++) {
                // on initial load, wrap the whole thing in a div
                selectedTable = largeTables[i]
                var newDiv = document.createElement("div")
                newDiv.className = "lc_tablewrapper"
                selectedTable.parentNode.insertBefore(newDiv, selectedTable)
                newDiv.appendChild(selectedTable)

                // fire off the scaling
                scaleIt(selectedTable)
            }
        }
        
        setupEquations()

    }

    window.addEventListener("resize", resizeThrottler, false);

    var resizeTimeout;

    function resizeThrottler() {
        // ignore resize events as long as an actualResizeHandler execution is in the queue
        if (!resizeTimeout && !supportsTouch) {
            resizeTimeout = setTimeout(function() {
                resizeTimeout = null;
                resizeWatcher();
                // The resize Watcher will execute at a rate of 15fps
            }, 66);
        }
    }

    function resizeWatcher() {

        if (largeTables.length > 0) {
            for (var i = 0; i < largeTables.length; i++) {
                selectedTable = largeTables[i]
                scaleIt(selectedTable)
            }
        }

        resizeEquations()

    }


    //find the closest figure parent


    function findAncestor(el, classname) {
        while ((el = el.parentElement) && !el.classList.contains(classname));
        return el;
    }

    function ancestorTag(node) {
        // walk tree until you reach a section
        var newNode = node,
            isParent = false

            do {
                newNode = newNode.parentNode
                if (newNode.nodeName.toLowerCase() == "figure" || newNode.nodeName.toLowerCase() == "section" || newNode.nodeName.toLowerCase() == "aside" || newNode.nodeName.toLowerCase() == "li") isParent = true
                //console.log(newNode)
            } while (!isParent)

            return newNode
    }


    //find the closest figure parent


    function hasClass(el, selector) {
        var className = " " + selector + " ";

        if ((" " + el.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1) {
            return true;
        }

        return false;
    }

    //auto width columns


    function autoCalculateColWidth(tableEl) {
        var $table = $(tableEl);



        var $theadCells = $table.find('thead tr').children(),
            colCount
            // var colCount = $table.find('thead tr').length,
            //  colWidth = $table.parent().width() / colCount

        var $tbodyCells = $table.find('tbody tr:first').children();

        // Get the tbody columns width array
        colWidth = $tbodyCells.map(function() {
            return $(this).width();
        });

        // Set the width of thead columns
        $theadCells.each(function(i, v) {
            $(v).width(colWidth[i]);
        });

    }

    // Wrap an HTMLElement around each element in an HTMLElement array.
    HTMLElement.prototype.wrap = function(elms) {
        // Convert `elms` to an array, if necessary.
        if (!elms.length) elms = [elms];

        // Loops backwards to prevent having to clone the wrapper on the
        // first element (see `child` below).
        for (var i = elms.length - 1; i >= 0; i--) {
            var child = (i > 0) ? this.cloneNode(true) : this;
            var el = elms[i];

            // Cache the current parent and sibling.
            var parent = el.parentNode;
            var sibling = el.nextSibling;

            // Wrap the element (is automatically removed from its current
            // parent).
            child.appendChild(el);

            // If the element had a sibling, insert the wrapper before
            // the sibling to maintain the HTML structure; otherwise, just
            // append it to the parent.
            if (sibling) {
                parent.insertBefore(child, sibling);
            } else {
                parent.appendChild(child);
            }
        }
    }
    
    // check the readyState so it will load even if the the document has already loaded
    if(document.readyState == "loaded" || document.readyState == "complete"){
        init()
    } else {
        // not loaded, bind an event
        document.onreadystatechange = function(){
            if(document.readyState == "loaded" || document.readyState == "complete"){
                init()
            }
        }
    }

}(window.jQuery)
