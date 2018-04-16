/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @license MIT
 * 修改记录：
 * 1.拖动项增加了向左滑动时出现删除按钮，向右滑动清除删除按钮功能，并增加删除事件的回调方法，供外部使用。
 */

(function sortableModule(factory) {
	"use strict";

	if (typeof define === "function" && define.amd) {
		define(factory);
	}
	else if (typeof module != "undefined" && typeof module.exports != "undefined") {
		module.exports = factory();
	}
	else {
		/* jshint sub:true */
		window["Sortable"] = factory();
	}
})(function sortableFactory() {
    "use strict";
    if (typeof window == "undefined" || !window.document) {
        return function sortableError() {
            throw new Error("Sortable.js requires a window with a document");
        };
    }
    //内部参数
    var dragEl,//当前拖拽节点,开始拖拽节点，鼠标按下去的节点
		parentEl,
		ghostEl,// 拖拽镜像节点
		cloneEl,//克隆节点
		rootEl,//鼠标开始按下去拖拽的根节点
		nextEl,//下一个节点
		lastDownEl,
		scrollEl,//滚动节点
		scrollParentEl,//滚动的父节点
		scrollCustomFn,
		lastEl,//根节点中的最后一个子节点
		lastCSS,
		lastParentCSS,
		oldIndex,//开始拖拽节点的索引 就是鼠标按下去拖拽节点的索引
		newIndex,//拖拽完之后现在节点
		activeGroup,
		putSortable,
		autoScroll = {},//滚动对象用于存鼠标的xy轴
		tapEvt,
		touchEvt,
		moved,
		undragedX,//未拖动前的横坐标值
		undragedY,//未拖动前的纵坐标值
        isTop,//拖动的方向，true为上拉，false为下拉        
        oldTouchedObj,//上一次被触碰到的步骤对象,dom对象
        prevDragY,//上一次的拖动的纵坐标值，和下一次对比，以判断拖动的方向
		clickCount=0,//打开链接的次数
		/** @const */
		R_SPACE = /\s+/g,//全局匹配空格
		R_FLOAT = /left|right|inline/,
		expando = 'Sortable' + (new Date).getTime(),//字符串Sortable+时间戳
		win = window,//缩写win
		document = win.document,
		parseInt = win.parseInt,
		$ = win.jQuery || win.Zepto,
		Polymer = win.Polymer,
		captureMode = false,
		supportDraggable = !!('draggable' in document.createElement('div')),
		//判断浏览器是否支持css3 这个属性pointer-events		
		supportCssPointerEvents = (function (el) {
		    // 当浏览器为IE11时为false
		    if (!!navigator.userAgent.match(/Trident.*rv[ :]?11\./)) {
		        return false;
		    }
		    el = document.createElement('x');
		    el.style.cssText = 'pointer-events:auto';
		    return el.style.pointerEvents === 'auto';
		})(),
		_silent = false,//默认
		abs = Math.abs,
		min = Math.min,
		savedInputChecked = [],
		touchDragOverListeners = [],//新建一个数组，鼠标触摸拖拽数组		
		/***********************************************************************************************
		*函数名 ：_autoScroll
		*函数功能描述 ： 拖拽智能滚动
		*函数参数 ： 
		 evt：类型：boj, 事件对象
		 options：类型：obj， 参数类
		 rootEl：类型：obj dom节点，拖拽的目标节点 
		*函数返回值 ： viod		
		***********************************************************************************************/
		_autoScroll = _throttle(function (/**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl) {
		    //每次拖拽只会调用一次该函数
		    //evt 是事件对象 event
		    //options.scroll如果为真 并且rootEl 为真的时候
		    // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521		    
		    if (rootEl && options.scroll) {
		        var _this = rootEl[expando],
					el,
					rect,
					sens = options.scrollSensitivity,//滚动的灵敏度,其实是拖拽离滚动边界的距离触发事件的距离边界+-30px的地方触发拖拽滚动事件，
					speed = options.scrollSpeed,//滚动速度
					x = evt.clientX,
					y = evt.clientY,
					winWidth = window.innerWidth,
					winHeight = window.innerHeight,
					vx,
					vy,
					scrollOffsetX,
					scrollOffsetY
		        ;

		        // 观察滚动节点 如果滚动的父节点scrollParentEl不等于当前的根节点的时候则可以滚动
		        if (scrollParentEl !== rootEl) {
		            //console.log("rootEl的类名为:" + rootEl.className);
		            scrollEl = options.scroll;//滚动的容器对象
		            scrollParentEl = rootEl;
		            scrollCustomFn = options.scrollFn;

		            if (scrollEl === true) {
		                scrollEl = rootEl;
		                do {
		                    //判断父节点，哪个父节点出现滚动条，如果有滚动条则设置该拖拽的节点滚动条父节点
		                    if ((scrollEl.offsetWidth < scrollEl.scrollWidth) || (scrollEl.offsetHeight < scrollEl.scrollHeight)) {
		                        break;
		                    }
		                    /* jshint boss:true */
		                } while (scrollEl = scrollEl.parentNode);
		            }
		        }

		        if (scrollEl) {
		            //console.log("scrollEl的类名为:" + scrollEl.className);
		            el = scrollEl;
		            rect = scrollEl.getBoundingClientRect();//getBoundingClientRect属性判断dom节点的左边，右边，上面，还是下面的坐标位置
		            //利用布尔值相加相减，做0和1判断，利用了事件绑定来判定两个列表中的不同元素
                    //flase为0，true为1，如果vy为1，表示碰到滚动区域的下边线，如果为0，表示在中间位置，如果为-1表示碰到上边线
		            vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
		            vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
		        }

		        if (!(vx || vy)) {//当他等于0的时候 拖拽滚动的是window
		            vx = (winWidth - x <= sens) - (x <= sens);
		            vy = (winHeight - y <= sens) - (y <= sens);
		            /* jshint expr:true */
		            (vx || vy) && (el = win);
		        }
		        //console.log("任何一个为true就可以滚动:x:" + (autoScroll.vx !== vx) + " y:" + (autoScroll.vy !== vy) + " dom:" + (autoScroll.el !== el));
		        if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {	     
		            autoScroll.el = el;
		            autoScroll.vx = vx;
		            autoScroll.vy = vy;
		            clearInterval(autoScroll.pid);//清除滚动		            
		            if (el) {
		                //每隔24毫秒就调用一次滚动
		                var scrollConut = 0;
		                autoScroll.pid = setInterval(function () {
		                    scrollOffsetY = vy ? vy * speed : 0;
		                    scrollOffsetX = vx ? vx * speed : 0;
		                    if ('function' === typeof(scrollCustomFn)) {
		                        return scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt);
		                    }
		                    if (el === win) {
		                        win.scrollTo(win.pageXOffset + scrollOffsetX, win.pageYOffset + scrollOffsetY);
		                    } else {
		                        if (vy > 0) {
		                            console.log("向下滚动：" + scrollOffsetY + " 滚动对象类名：" + $(el).attr("class") + "滚动次数：" + (scrollConut++));
		                            //debugger;//开始向下滚动
		                        }
		                        if (vy < 0) {
		                            console.log("向上滚动：" + scrollOffsetY + " 滚动对象类名：" + $(el).attr("class") + "滚动次数：" + (scrollConut++));
		                            //debugger;//开始向上滚动
		                        }
		                        el.scrollTop += scrollOffsetY;//设置元素滚动条的位置,每次滚动1*speed如果是0 则不会滚动
		                        el.scrollLeft += scrollOffsetX;//设置元素滚动条的位置
		                    }
		                }, 24);
		            }
		        }
		    }
		}, 30),
		
        /***********************************************************************************************
		*函数名 ：_prepareGroup
		*函数功能描述 ： //options.group 属性变成对象 。如果group不是对象则变成对象，并且group对象的name就等于改group的值 并且添加多['pull', 'put'] 属性默认值是true
		如果设置group{
		pull:true, 则可以拖拽到其他列表 否则反之
		put:true, 则可以从其他列表中放数据到改列表，false则反之
		}
		pull: 'clone', 还有一个作用是克隆，就是当这个列表拖拽到其他列表的时候不会删除改列表的节点。
		*函数参数 ：options：类型：boj, options 拖拽参数		  
		*函数返回值 ： viod		
		***********************************************************************************************/
		_prepareGroup = function (options) {
		    function toFn(value, pull) {
		        if (value === void 0 || value === true) {
		            value = group.name;
		        }
		        if (typeof value === 'function') {
		            return value;
		        } else {
		            return function (to, from) {
		                var fromGroup = from.options.group.name;

		                return pull
							? value
							: value && (value.join
								? value.indexOf(fromGroup) > -1
								: (fromGroup == value)
							);
		            };
		        }
		    }
		    var group = {};
		    var originalGroup = options.group;
		    if (!originalGroup || typeof originalGroup != 'object') {
		        originalGroup = {name: originalGroup};
		    }
		    group.name = originalGroup.name;
		    group.checkPull = toFn(originalGroup.pull, true);
		    group.checkPut = toFn(originalGroup.put);
		    group.revertClone = originalGroup.revertClone;
		    options.group = group;
		}
    ;

    /**
	 * @class  Sortable
	 * @param  {HTMLElement}  el
	 * @param  {Object}       [options]
	 */
    function Sortable(el, options) {
        if (!(el && el.nodeType && el.nodeType === 1)) {
            throw 'Sortable: `el` 参数必须是一个dom对象，而不是一个' + {}.toString.call(el);
        }

        this.el = el.getElementsByTagName("ul")[0]; // 拖动对象的根节点
        this.options = options = _extend({}, options);

        // Export instance
        el = this.el;//将div转向UL容器
        el[expando] = this;        
        // 默认参数
        var defaults = {
            group: Math.random(),//产生一个随机数 //产生一个随机数 
            //该参数是对象，有两个参数pull: 拉, put:放 默认都是true，pull还有一个值是: 'clone', pull: 拉, put:放 
            //设置为false 就不能拖拽了， 如果 pull参数为'clone'时则可以从一个列表中拖拽到另一个列表并且克隆dom节点， 
            //name：是两个或者多个列表拖拽之间的通信，如果name相同则他们可以互相拖拽
            sort: true,// 类型：Boolean,分类；false时在自己的拖拽区域不能拖拽，但是可以拖拽到其他区域，true则可以做自己区域拖拽或者其他授权地方拖拽
            disabled: false,//类型：Boolean 是否禁用拖拽 true 则不能拖拽 默认是true；定义是否此sortable对象是否可用，为true时sortable对象不能拖放排序等功能，为false时为可以进行排序，相当于一个开关；
            store: null,// 用来html5 存储的 改返回 拖拽的节点的唯一id
            handle: null,//handle 这个参数是设置该标签，或者该class可以拖拽 但是不要设置 id的节点和子节点相同的tag不然会有bug
            scroll: true,//类型：Boolean，设置拖拽的时候滚动条是否智能滚动。默认为真，则智能滚动，false则不智能滚动；默认为true，当排序的容器是个可滚动的区域，拖放可以引起区域滚动
            scrollSensitivity: 30,//滚动的灵敏度,其实是拖拽离滚动边界的距离触发事件的距离边界+-30px的地方触发拖拽滚动事件，
            scrollSpeed: 10,//滚动速度
            direction: 'y',//拖动方向，值选择X,Y,ALL，分别代表水平移动，垂直移动，和全方向移动，默认为all
            draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',//draggable 判断拖拽节点的父层是否是ou ul，格式为简单css选择器的字符串，定义哪些列表单元可以进行拖放
            ghostClass: 'sortable-ghost',//排序镜像class,就是当鼠标拉起拖拽节点的时候添加该class
            chosenClass: 'sortable-chosen',//为拖拽的节点添加一个class 开始拖拽鼠标按下去的时候 添加该class
            dragClass: 'sortable-drag',// 正在拖动中的对象样式类名
            ignore: 'a, img',//a或者是img,需要过滤忽略的DOM节点
            filter: null,//该参数可以传递一个函数，或者字符串，字符串可以是class或者tag，然后用于触发oFilter函数，这样可以用来自定义事件等
            delEvent:null,//删除回调函数
            openLink:null,//打开链接的回调函数
            preventOnFilter: true,// 当触发“filter”事件时调用“event.preventDefault()”
            animation: 0,//拖拽动画时间戳
            setData: function (dataTransfer, dragEl) {//设置拖拽传递的参数
                dataTransfer.setData('Text', dragEl.textContent);
            },
            dropBubble: false,// 发生 drop事件时，拖拽的时候是否阻止事件冒泡 
            dragoverBubble: false,//发生 dragover 事件时，拖拽的时候是否阻止事件冒泡 
            dataIdAttr: 'data-id',//拖拽元素的id 数组
            delay: 5,//延迟拖拽时间, 其实就是鼠标按下去拖拽延迟
            forceFallback: false,//如果设置为true时，将不使用原生的html5的拖放，可以修改一些拖放中元素的样式等；
            fallbackClass: 'sortable-fallback',//当forceFallback设置为true时，拖放过程中鼠标附着单元的样式；
            fallbackOnBody: false,// 是否把拖拽镜像节点ghostEl放到body上
            fallbackTolerance: 0,
            fallbackOffset: {x: 0, y: 0}
        };
		
        // 设置默认参数：当options类中的数据没有defaults类中的数据的时候 就把defaults类中的数据赋值给options类
        for (var name in defaults) {
            !(name in options) && (options[name] = defaults[name]);
        }
        //把group: 变成一个对象，本来是一个属性的
        _prepareGroup(options);

        // 绑定所有的私有函数
        for (var fn in this) {
            if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
                this[fn] = this[fn].bind(this);
            }
        }

        // Setup drag mode
        // forceFallback 如果是false，那么将supportDraggable 函数给它，然后判断浏览器是否支持draggable，拖拽如果支持是true，否则是false
        this.nativeDraggable = options.forceFallback ? false : supportDraggable;
        //绑定事件 ，入口从这里开始		
        _on(el, 'mousedown', this._onTapStart);
        _on(el, 'touchstart', this._onTapStart);
        _on(el, 'pointerdown', this._onTapStart);
        //html5 dragover 添加拖拽事件
        if (this.nativeDraggable) {
            //传递整个类进去
            _on(el, 'dragover', this);//然后会执行这个函数handleEvent
            _on(el, 'dragenter', this);
        }
        //touchDragOverListeners 添加一个false 数据到数组里。
        touchDragOverListeners.push(this._onDragOver);

        // Restore sorting
        // sort 排序函数
        // store 是null 未找到get函数不知道怎么回事 可能它是属于store.js的api
        options.store && this.sort(options.store.get(this));
    }

    /***********************************************************************************************
	 *函数名 ：Sortable.prototype 
	 *函数功能描述 ： 主类的原型	
	 ***********************************************************************************************/
    Sortable.prototype = /** @lends Sortable.prototype */ {
        constructor: Sortable,
		
        /***********************************************************************************************
         *函数名 ：_onTapStart
         *函数功能描述 ： 鼠标按下去函数,oldIndex统计目标节点与同级同胞的上节点总和
         *函数参数 ： viod
         *函数返回值 ： 无        
         ***********************************************************************************************/
        _onTapStart: function (/** Event|TouchEvent */evt) {
            var _this = this,
				el = this.el,
				options = this.options,
				preventOnFilter = options.preventOnFilter,
				type = evt.type,
				touch = evt.touches && evt.touches[0],
				target = (touch || evt).target,
				originalTarget = evt.target.shadowRoot && evt.path[0] || target,
				filter = options.filter,
				startIndex;
            _saveInputCheckedState(el);
            // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.
            if (dragEl) {
                return;
            }
            if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
                return; // only left button or enabled
            }
            target = _closest(target, options.draggable, el);
            if (!target) {
                return;
            }
            if (lastDownEl === target) {
                // Ignoring duplicate `down`
                return;
            }
            // Get the index of the dragged element within its parent
            startIndex = _index(target, options.draggable);
            // Check filter
            if (typeof filter === 'function') {
                if (filter.call(this, evt, target, this)) {
                    _dispatchEvent(_this, originalTarget, 'filter', target, el, startIndex);
                    preventOnFilter && evt.preventDefault();
                    return; // cancel dnd
                }
            }
            else if (filter) {
                filter = filter.split(',').some(function (criteria) {
                    criteria = _closest(originalTarget, criteria.trim(), el);
                    if (criteria) {
                        _dispatchEvent(_this, criteria, 'filter', target, el, startIndex);
                        return true;
                    }
                });
                if (filter) {
                    preventOnFilter && evt.preventDefault();
                    return; // cancel dnd
                }
            }
            if (options.handle && !_closest(originalTarget, options.handle, el)) {
                return;
            }
            // Prepare `dragstart`
            this._prepareDragStart(evt, touch, target, startIndex);
        },
		
        /***********************************************************************************************
		 *函数名 ：_onTapStart
		 *函数功能描述 ： 开始准备拖
		 *函数参数 ： evt：类型:obj,事件对象
		  touch：类型:obj,触摸事件对象，判断是否是触摸事件还是鼠标事件
		  target： 类型:dom-obj,目标节点
		 *函数返回值 ： 无		 
		 ***********************************************************************************************/
        _prepareDragStart: function (/** Event */evt, /** Touch */touch, /** HTMLElement */target, /** Number */startIndex) {
            var _this = this,
				el = _this.el,
				options = _this.options,
				ownerDocument = el.ownerDocument,
				dragStartFn;

            if (target && !dragEl && (target.parentNode === el)) {
                tapEvt = evt;
                rootEl = el;
                dragEl = target;
                parentEl = dragEl.parentNode;
                nextEl = dragEl.nextSibling;
                lastDownEl = target;
                activeGroup = options.group;
                oldIndex = startIndex;

                this._lastX = (touch || evt).clientX;
                this._lastY = (touch || evt).clientY;
                undragedX=this._lastX;//将当前未拖动时的X坐标记录下
                undragedY=this._lastY;//将当前未拖动时的Y坐标记录下				
                dragEl.style['will-change'] = 'transform';

                dragStartFn = function () {
                    // Delayed drag has been triggered
                    // we can re-enable the events: touchmove/mousemove
                    _this._disableDelayedDrag();

                    // Make the element draggable
                    dragEl.draggable = _this.nativeDraggable;

                    // Chosen item
                    _toggleClass(dragEl, options.chosenClass, true);

                    // Bind the events: dragstart/dragend
                    _this._triggerDragStart(evt, touch);

                    // Drag start event
                    _dispatchEvent(_this, rootEl, 'choose', dragEl, rootEl, oldIndex);
                };

                // Disable "draggable"
                options.ignore.split(',').forEach(function (criteria) {
                    _find(dragEl, criteria.trim(), _disableDraggable);
                });

                _on(ownerDocument, 'mouseup', _this._onDrop);
                _on(ownerDocument, 'touchend', _this._onDrop);
                _on(ownerDocument, 'touchcancel', _this._onDrop);
                _on(ownerDocument, 'pointercancel', _this._onDrop);
                _on(ownerDocument, 'selectstart', _this);

                if (options.delay) {
                    //dragEl.style.backgroundColor="#c0c0c0";//可拖动时变灰					
                    // If the user moves the pointer or let go the click or touch
                    // before the delay has been reached:
                    // disable the delayed drag
                    _on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
                    _on(ownerDocument, 'touchend', _this._disableDelayedDrag);
                    _on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
                    _on(ownerDocument, 'mousemove', _this._disableDelayedDrag);
                    _on(ownerDocument, 'touchmove', _this._disableDelayedDrag);
                    _on(ownerDocument, 'pointermove', _this._disableDelayedDrag);

                    _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
                } else {
                    dragStartFn();
                }
            }
        },
       
        /***********************************************************************************************
         *函数名 ：_disableDelayedDrag
         *函数功能描述 ： 禁用延迟拖拽，当拖拽延时的时候，把所有事件解绑，并且关闭定时器。
         *函数参数 ：
         *函数返回值 ：         
         ***********************************************************************************************/
        _disableDelayedDrag: function () {
            var ownerDocument = this.el.ownerDocument;
            clearTimeout(this._dragStartTimer);
            _off(ownerDocument, 'mouseup', this._disableDelayedDrag);
            _off(ownerDocument, 'touchend', this._disableDelayedDrag);
            _off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
            _off(ownerDocument, 'mousemove', this._disableDelayedDrag);
            _off(ownerDocument, 'touchmove', this._disableDelayedDrag);
            _off(ownerDocument, 'pointermove', this._disableDelayedDrag);
        },

        /***********************************************************************************************
        *函数名 ：_triggerDragStart
        *函数功能描述 ： 为拖拽前做好准本，包括判断是否是触摸设备，或者pc，或者没有dragend
        *函数参数 ：
        *函数返回值 ：
        ***********************************************************************************************/
        _triggerDragStart: function (/** Event */evt, /** Touch */touch) {
            touch = touch || (evt.pointerType == 'touch' ? evt : null);            
            if (touch) {
                // Touch device support
                tapEvt = {
                    target: dragEl,
                    clientX: touch.clientX,
                    clientY: touch.clientY
                };

                this._onDragStart(tapEvt, 'touch');
            }
            else if (!this.nativeDraggable) {
                this._onDragStart(tapEvt, true);
            }
            else {
                _on(dragEl, 'dragend', this);
                _on(rootEl, 'dragstart', this._onDragStart);
            }

            try {
                if (document.selection) {
                    // Timeout neccessary for IE9
                    setTimeout(function () {
                        document.selection.empty();
                    });
                } else {
                    window.getSelection().removeAllRanges();
                }
            } catch (err) {
            }
        },

        _dragStarted: function () {
            if (rootEl && dragEl) {
                var options = this.options;
                // Apply effect
                _toggleClass(dragEl, options.ghostClass, true);//添加占位样式
                _toggleClass(dragEl, options.dragClass, false);

                Sortable.active = this;                
                // Drag start event
                _dispatchEvent(this, rootEl, 'start', dragEl, rootEl, oldIndex);
            } else {                
                this._nulling();
            }
        },

        _emulateDragOver: function () {
            if (touchEvt) {
                if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY) {
                    return;
                }

                this._lastX = touchEvt.clientX;
                this._lastY = touchEvt.clientY;

                if (!supportCssPointerEvents) {
                    _css(ghostEl, 'display', 'none');
                }

                //elementFromPoint根据横纵坐标值 iX 和 iY 获取对象oElement。oElement 必须支持和响应鼠标事件。
                var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY),
					parent = target,
					i = touchDragOverListeners.length;

                if (parent) {
                    do {
                        if (parent[expando]) {
                            while (i--) {
                                touchDragOverListeners[i]({
                                    clientX: touchEvt.clientX,
                                    clientY: touchEvt.clientY,
                                    target: target,
                                    rootEl: parent
                                });
                            }

                            break;
                        }

                        target = parent; // store last element
                    }
                        /* jshint boss:true */
                    while (parent = parent.parentNode);
                }

                if (!supportCssPointerEvents) {
                    _css(ghostEl, 'display', '');
                }
            }
        },

        /***********************************************************************************************
		 *函数名 ：_onTouchMove
		 *函数功能描述 ： 触摸移动拖拽动画事件ghostEl，把拖拽移动的xy值给ghostEl节点
		 *函数参数 ： viod		
		 ***********************************************************************************************/
        _onTouchMove: function (/**TouchEvent*/evt) {            
            if (tapEvt) {
                var options = this.options,
					fallbackTolerance = options.fallbackTolerance,
					fallbackOffset = options.fallbackOffset,
					touch = evt.touches ? evt.touches[0] : evt,
					dx = (touch.clientX - tapEvt.clientX) + fallbackOffset.x,
					dy = (touch.clientY - tapEvt.clientY) + fallbackOffset.y;

                var translate3d;
                if (options.direction == 'x') {//只可上下移动
                    //translate3d = evt.touches ? 'translate3d(' + dx + 'px,0px,0)' : 'translate(' + dx + 'px,0px)';
                    translate3d = 'translate3d(' + dx + 'px,0px,0)';
                }
                else if (options.direction == 'y') {//只可左右移动
                    //translate3d = evt.touches ? 'translate3d(0px,' + dy + 'px,0)' : 'translate(0px,' + dy + 'px)';
                    translate3d = 'translate3d(0px,' + dy + 'px,0)';
                }
                else {//全方向移动
                    //translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';
                    translate3d = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
                }
                // only set the status to dragging, when we are actually dragging                
                if (!Sortable.active) {
                    if (fallbackTolerance && min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY)) < fallbackTolerance) {
                        return;
                    }
                    this._dragStarted();
                }                
                // as well as creating the ghost element on the document body
                this._appendGhost();
                moved = true;
                touchEvt = touch;
                _css(ghostEl, 'webkitTransform', translate3d);
                _css(ghostEl, 'mozTransform', translate3d);
                _css(ghostEl, 'msTransform', translate3d);
                _css(ghostEl, 'transform', translate3d);
                evt.preventDefault();
            }
        },

        /***********************************************************************************************
         *函数名 ：_appendGhost
         *函数功能描述 ： 创建一个ghostEl dom节点，并且是克隆拖拽节点的rootEl下面就是id那个dom节点，添加在，
         *并且设置了一些属性，高,宽，top，left，透明度，鼠标样式，
         *函数参数 ： viod
         *函数返回值 ： 无         
         ***********************************************************************************************/
        _appendGhost: function () {
            if (!ghostEl) {
                var rect = dragEl.getBoundingClientRect(),
					css = _css(dragEl),
					options = this.options,
					ghostRect;

                ghostEl = dragEl.cloneNode(true);

                _toggleClass(ghostEl, options.ghostClass, false);
                _toggleClass(ghostEl, options.fallbackClass, true);
                _toggleClass(ghostEl, options.dragClass, true);

                _css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
                _css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
                _css(ghostEl, 'width', rect.width);
                _css(ghostEl, 'height', rect.height);
                _css(ghostEl, 'opacity', '0.8');
                _css(ghostEl, 'position', 'fixed');
                _css(ghostEl, 'zIndex', '100000');
                _css(ghostEl, 'pointerEvents', 'none');

                options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl);

                // Fixing dimensions.
                ghostRect = ghostEl.getBoundingClientRect();
                _css(ghostEl, 'width', rect.width * 2 - ghostRect.width);
                _css(ghostEl, 'height', rect.height * 2 - ghostRect.height);
            }
        },
         
        /***********************************************************************************************
		*函数名 ：_onDragStart
		*函数功能描述 ： 拖拽开始，为document添加触摸事件与鼠标事件 
		*函数参数 ：evt：类型:obj, 事件对象
		 useFallback:类型：string， Boolean 值 		
		***********************************************************************************************/
        _onDragStart: function (/**Event*/evt, /**boolean*/useFallback) {
            var dataTransfer = evt.dataTransfer,
				options = this.options;

            this._offUpEvents();

            if (activeGroup.checkPull(this, this, dragEl, evt)) {
                cloneEl = _clone(dragEl);

                cloneEl.draggable = false;
                cloneEl.style['will-change'] = '';

                _css(cloneEl, 'display', 'none');
                _toggleClass(cloneEl, this.options.chosenClass, false);

                rootEl.insertBefore(cloneEl, dragEl);
                _dispatchEvent(this, rootEl, 'clone', dragEl);
            }

            _toggleClass(dragEl, options.dragClass, true);

            if (useFallback) {
                if (useFallback === 'touch') {
                    // Bind touch events
                    _on(document, 'touchmove', this._onTouchMove);
                    _on(document, 'touchend', this._onDrop);
                    _on(document, 'touchcancel', this._onDrop);
                    _on(document, 'pointermove', this._onTouchMove);
                    _on(document, 'pointerup', this._onDrop);
                } else {
                    // Old brwoser
                    _on(document, 'mousemove', this._onTouchMove);
                    _on(document, 'mouseup', this._onDrop);
                }
                this._loopId = setInterval(this._emulateDragOver, 50);
            }
            else {
                if (dataTransfer) {
                    dataTransfer.effectAllowed = 'move';
                    options.setData && options.setData.call(this, dataTransfer, dragEl);
                }
                _on(document, 'drop', this);
                setTimeout(this._dragStarted, 0);
            }
        },        

        /***********************************************************************************************
		 *函数名 ：_onDragOver
		 *函数功能描述 ： 拖拽元素进入拖拽区域， 判断拖拽节点与拖拽碰撞的节点，交换他们的dom节点位置，并执行动画。 
		 *函数参数 ：evt		
		 ***********************************************************************************************/
		_onDragOver: function (/**Event*/evt) {
			var el = this.el,//当前容器对象
				target,
				dragRect,
				targetRect,
				revert,
				options = this.options,
				group = options.group,
				activeSortable = Sortable.active,
				isOwner = (activeGroup === group),
				isMovingBetweenSortable = false,
				canSort = options.sort;

			if (evt.preventDefault !== void 0) {
				evt.preventDefault();
				!options.dragoverBubble && evt.stopPropagation();
			}

			if (dragEl.animated) {
				return;
			}	
			moved = true;
			//el.style.border = "1px red solid";
			removeElementsByClass("delLink");//删除其他类
			//拖动到目标前，先删除出现的删除链接等
			if(dragEl.getElementsByTagName("span").length>0){
				var links=dragEl.getElementsByTagName("span")[0];	 
            	if(links){
            		dragEl.removeChild(links);
            	}	
			}
			///////////////////////////////////////////////拖动触碰步骤节点////////////////////////////////////////////////
		    //触碰地图步骤节点事件
			if (prevDragY == undefined) {
			    prevDragY = undragedY;
			}			
			var isDragTop = this._dragDirection(dragEl);//测试拖动的方向
			this._isTouchTitle(dragEl,evt);//测试是否触碰到地图步骤节点
			prevDragY = dragEl.offsetTop;//记录当前的纵坐标值
		    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
			if (activeSortable && !options.disabled &&
				(isOwner ? canSort || (revert = !rootEl.contains(dragEl)) // 恢复到原始的列表项中
					: (
						putSortable === this ||
						(
							(activeSortable.lastPullMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) &&
							group.checkPut(this, activeSortable, dragEl, evt)
						)
					)
				) &&(evt.rootEl === void 0 || evt.rootEl === this.el) // touch fallback
			) {
			    // 智能滚动
			    var curScrollObj = this.el.parentNode;//转成父级
			    _autoScroll(evt, options, curScrollObj);
				//_autoScroll(evt, options, this.el);

				if (_silent) {
					return;
				}

				target = _closest(evt.target, options.draggable, el);
				dragRect = dragEl.getBoundingClientRect();

				if (putSortable !== this) {
					putSortable = this;
					isMovingBetweenSortable = true;
				}

				if (revert) {
					_cloneHide(activeSortable, true);
					parentEl = rootEl; // actualization
					if (cloneEl || nextEl) {
						rootEl.insertBefore(dragEl, cloneEl || nextEl);
					}
					else if (!canSort) {
						rootEl.appendChild(dragEl);
					}
					return;
				}

				if ((el.children.length === 0) || (el.children[0] === ghostEl) ||(el === evt.target) && (_ghostIsLast(el, evt))) {
					//assign target only if condition is true
					if (el.children.length !== 0 && el.children[0] !== ghostEl && el === evt.target) {
						target = el.lastElementChild;
					}
					if (target) {
						if (target.animated) {
							return;
						}

						targetRect = target.getBoundingClientRect();
					}
					_cloneHide(activeSortable, isOwner);
					if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt) !== false) {
						if (!dragEl.contains(el)) {
							el.appendChild(dragEl);
							parentEl = el; // actualization
						}
						this._animate(dragRect, dragEl);
						target && this._animate(targetRect, target);
					}
				}
				else if (target && !target.animated && target !== dragEl && (target.parentNode[expando] !== void 0)) {
					if (lastEl !== target) {
						lastEl = target;
						lastCSS = _css(target);
						lastParentCSS = _css(target.parentNode);
					}

					targetRect = target.getBoundingClientRect();

					var width = targetRect.right - targetRect.left,
						height = targetRect.bottom - targetRect.top,
						floating = R_FLOAT.test(lastCSS.cssFloat + lastCSS.display)
							|| (lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0),
						isWide = (target.offsetWidth > dragEl.offsetWidth),
						isLong = (target.offsetHeight > dragEl.offsetHeight),
						halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5,
						nextSibling = target.nextElementSibling,
						after = false
					;

					if (floating) {
						var elTop = dragEl.offsetTop,
							tgTop = target.offsetTop;

						if (elTop === tgTop) {
							after = (target.previousElementSibling === dragEl) && !isWide || halfway && isWide;
						}
						else if (target.previousElementSibling === dragEl || dragEl.previousElementSibling === target) {
							after = (evt.clientY - targetRect.top) / height > 0.5;
						} else {
							after = tgTop > elTop;
						}
						} else if (!isMovingBetweenSortable) {
						after = (nextSibling !== dragEl) && !isLong || halfway && isLong;
					}

					var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
					if (moveVector !== false) {
						if (moveVector === 1 || moveVector === -1) {
							after = (moveVector === 1);
						}
						_silent = true;
						setTimeout(_unsilent, 30);
						_cloneHide(activeSortable, isOwner);
						if (!dragEl.contains(el)) {
							if (after && !nextSibling) {
								el.appendChild(dragEl);
							} else {
								target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
							}
						}
						parentEl = dragEl.parentNode; // actualization
						this._animate(dragRect, dragEl);
						this._animate(targetRect, target);
					}
				}
			}
		},

        /***********************************************************************************************
         *函数名 ：_animate
         *函数功能描述 ： 动画效果，执行css3动画
         *函数参数 ： 
          prevRect：obj，初始动画的坐标，
          target：obj，target 其实最重要是获取交换dom节点后的坐标
         *函数返回值 ：         
         ***********************************************************************************************/
		_animate: function (prevRect, target) {
			var ms = this.options.animation;

			if (ms) {
				var currentRect = target.getBoundingClientRect();

				if (prevRect.nodeType === 1) {
					prevRect = prevRect.getBoundingClientRect();
				}				
                //添加拖动方向支持
				var translate3d;
				if (this.options.direction == 'x') {//只可上下移动
				    translate3d = 'translate3d(' + (prevRect.left - currentRect.left) + 'px,0px,0)';				    
				}
				else if (this.options.direction == 'y') {//只可左右移动
				    translate3d = 'translate3d(0px,' + (prevRect.top - currentRect.top) + 'px,0)';
				}
				else {//全方向移动
				    translate3d = 'translate3d(' + (prevRect.left - currentRect.left) + 'px,' + (prevRect.top - currentRect.top) + 'px,0)';
				}

				_css(target, 'transition', 'none');
				_css(target, 'transform', translate3d);//各种方向支持				
				//_css(target, 'transform', 'translate3d('
				//	+ (prevRect.left - currentRect.left) + 'px,'
				//	+ (prevRect.top - currentRect.top) + 'px,0)'
				//);

				target.offsetWidth; // repaint

				_css(target, 'transition', 'all ' + ms + 'ms');
				//_css(target, 'transform', 'translate3d(0,0,0)');
				_css(target, 'transform', translate3d);

				clearTimeout(target.animated);
				target.animated = setTimeout(function () {
					_css(target, 'transition', '');
					_css(target, 'transform', '');
					target.animated = false;
				}, ms);
			}
		},

        /***********************************************************************************************
        *函数名 ：_offUpEvents
        *函数功能描述 ： 解绑文档上的拖拽函数
        *函数参数 ： viod
        *函数返回值 ：viod        
        ***********************************************************************************************/
		_offUpEvents: function () {
			var ownerDocument = this.el.ownerDocument;
			_off(document, 'touchmove', this._onTouchMove);
			_off(document, 'pointermove', this._onTouchMove);
			_off(ownerDocument, 'mouseup', this._onDrop);
			_off(ownerDocument, 'touchend', this._onDrop);
			_off(ownerDocument, 'pointerup', this._onDrop);
			_off(ownerDocument, 'touchcancel', this._onDrop);
			_off(ownerDocument, 'pointercancel', this._onDrop);
			_off(ownerDocument, 'selectstart', this);	
		},		
        
        //垂直拖动方向判断
		_dragDirection: function (dragObj) {		    
		    var y = dragObj.offsetTop;
		    if (y > prevDragY) {//向下拖动		        
		        isTop = false;
		        //console.log("下拉" + isTop);
		    }
		    if (y < prevDragY) {//向上拖动		        
		        isTop = true;
		        //console.log("上拉" + isTop);
		    }
		},

        //当拖动对象位于地图的步骤节点时，如果本身是关闭的，则展开其子节点
		_openPrentNodes: function (obj,isLastUl) {		    
		    var ulObj = $(obj).next();
		    $(ulObj).removeClass("close");
		    $(obj).addClass("open");
		    if (isLastUl) {//最后一个UL节点
		        $(obj).removeClass("endNode");
		    }
		},

        //垂直方向触碰判断，就否触碰到标题容器，此函数在是拖动的过程中
		_isTouchTitle: function (dragObj,e) {
		    var parent = document.getElementsByClassName("jxScroll");
		    var list = parent[0].getElementsByTagName("h4");		    
		    var curY = 0;//记录用来判断触碰的Y值，如果向下拖动，则以拖动对象的下边线Y坐标，否则以上边线Y坐标		    
		    if (isTop) {
		        curY = dragObj.offsetTop;
		    }
		    else {
		        curY = dragObj.offsetTop + dragObj.offsetHeight;
		    }		    
            //和每一个步骤项对比，查看是否在这个范围内
		    for (var i = 0; i < list.length; i++) {		        
		        var obj = list[i];
		        var isLastUl=false;
		        if (i == list.length - 1) {//最后一个UL节点
		            isLastUl=true;
		        }		        
		        var tY = obj.offsetTop-10;//向上扩展10像素敏感距离
		        var bY = obj.offsetTop + obj.offsetHeight + 10;//向下扩展10像素敏感距离	
		        //console.log("参数值：" + " curY:" + curY + " tY:" + tY + " bY:" + bY);
		        if (curY > tY && curY < bY) {
		            //console.log("碰到某个节点了" + " curY:" + curY + " tY:" + tY + " bY:" + bY);
		            if (oldTouchedObj == undefined) {//第一次进来还没有赋值
		                oldTouchedObj = obj;//将找到的对象记录下来，以便匹配重复		                
		                obj.style.backgroundColor = "#F6D2CE";
		                this._openPrentNodes(obj, isLastUl);		                
		            }
		            else {
		                if (obj == oldTouchedObj) {//当前找到的对象和以前记录的对象相同，就不再执行操作了		                    
		                    obj.style.backgroundColor = "#F6D2CE";
		                }
		                else {
		                    obj.style.backgroundColor = "#F6D2CE";
		                    oldTouchedObj = obj
		                    this._openPrentNodes(obj, isLastUl);//展开关闭的父节点	
		                }
		            }
		        } else {
		            obj.style.backgroundColor = "#fff";	            
		        }
		    }	
		},

		/***********************************************************************************************
		 *函数名 ：释放函数
		 *函数功能描述 ： Drop被拖拽的元素在目标元素上同时鼠标放开触发的事件，此事件作用在目标元素上
		 ***********************************************************************************************/
		_onDrop: function (/**Event*/evt) {
			var el = this.el,//拖拽的根节点
				options = this.options;//参数类
			clearInterval(this._loopId);//清除_loopId 定时器
			clearInterval(autoScroll.pid);//清除pid 定时器
			clearTimeout(this._dragStartTimer);//清除_dragStartTimer 定时器
			// 解绑事件
			_off(document, 'mousemove', this._onTouchMove);//解除文档上面的鼠标移动事件函数为_onTouchMove
			if (this.nativeDraggable) {
				_off(document, 'drop', this);//解绑drop 事件 函数是handleEvent
				_off(el, 'dragstart', this._onDragStart);//解绑html5的拖拽dragstart事件 函数是 _onDragStart
			}			
			

			//解绑文档上面的一些事件
			this._offUpEvents();
			if (evt) {
			    //var touch = evt.touches ? evt.targetTouches[0] : evt;	
			    //console.log(evt.type);			    
			    var touch = evt.type == 'touchmove' ? evt.targetTouches[0] : evt;
			    //var touch = evt.type == 'touchstart' ? evt.originalEvent.changedTouches[0] : evt;
			    console.log("释放，当前事件类型为："+evt.type);
			    //console.log(touch);
				if (moved) {//如果被移动过		
					removeElementsByClass("delLink");//删除其他类
					//向左滑动出现删除功能，向左滑动，并且在上下移动5px范围内，则算为滑动删除功能触发
					var direction=touch.clientX-undragedX>0?"right":"left";//判断方向
					var scope=Math.abs(touch.clientY-undragedY)<5?"in":"out";//纵坐标移动的范围，上下5PX为敏感值				
	                if(direction=="left"&&scope=="in"){//向左滑动出现删除链接
	                	if(dragEl.getElementsByTagName("span").length==0){	
	                		var subLink=document.createElement("span");	 
		                	subLink.className="delLink";
		                	subLink.innerHTML="删除"
		                	dragEl.appendChild(subLink);
		                	_on(subLink,"click",function(){	
		                		var curObj=this;
		                		options.delEvent(curObj);//执行回调函数		                		
		                	});	
	                	}	
	                }
	                if(direction=="right"&&scope=="in"){//向左滑动删除删除链接
	                	var links=dragEl.getElementsByTagName("span")[0];	 
	                	if(links){
	                		dragEl.removeChild(links);
	                	}	
	                }
					
					evt.preventDefault();//阻止默认事件
					!options.dropBubble && evt.stopPropagation();//阻止事件冒泡
				}
				else{//如果未移动，则打开链接
//					if(clickCount<1){
//						options.openLink(touch.srcElement);//打开链接的回调方法
//						clickCount++;											
//					}
//					else{
//						clickCount=0;
//					}
				}
				ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
				if (rootEl === parentEl || Sortable.active.lastPullMode !== 'clone') {
					// Remove clone
					cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
				}
				if (dragEl) {
					if (this.nativeDraggable) {
						//如果拖拽节点存在了 就解绑this 的 handleEvent 事件
						_off(dragEl, 'dragend', this);
					}
					//禁用拖拽html5 属性
					_disableDraggable(dragEl);
					dragEl.style['will-change'] = '';
					// //删除css
					_toggleClass(dragEl, this.options.ghostClass, false);
					_toggleClass(dragEl, this.options.chosenClass, false);
					// Drag stop event
					_dispatchEvent(this, rootEl, 'unchoose', dragEl, rootEl, oldIndex);
					if (rootEl !== parentEl) {//如果从一个列表拖拽到另一个列表的时候
						newIndex = _index(dragEl, options.draggable);
						if (newIndex >= 0) {//如果当前的索引大于0
							// 添加事件
							_dispatchEvent(null, parentEl, 'add', dragEl, rootEl, oldIndex, newIndex);//添加节点拖拽函数创建与触发
							// 移除事件
							_dispatchEvent(this, rootEl, 'remove', dragEl, rootEl, oldIndex, newIndex);//删除节点拖拽函数创建与触发
							// 从一个列表到另一个列表的拖动
							_dispatchEvent(null, parentEl, 'sort', dragEl, rootEl, oldIndex, newIndex);//开始拖拽函数创建与触发
							_dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);//开始拖拽函数创建与触发
						}
					}
					else {//同一个列表中
						if (dragEl.nextSibling !== nextEl) {
							// Get the index of the dragged element within its parent
							newIndex = _index(dragEl, options.draggable);
							if (newIndex >= 0) {
								// drag & drop within the same list
								_dispatchEvent(this, rootEl, 'update', dragEl, rootEl, oldIndex, newIndex);
								_dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
							}
						}
					}
					//Sortable.active 存在说明已经拖拽开始了
					if (Sortable.active) {						
						if (newIndex == null || newIndex === -1) {
							newIndex = oldIndex;
						}
						//拖拽结束 
						_dispatchEvent(this, rootEl, 'end', dragEl, rootEl, oldIndex, newIndex);
						// 保存排序
						this.save();
					}
				}
			}
			this._nulling();
		},

        /***********************************************************************************************
         *函数名 ：_nulling
         *函数功能描述 ： 初始化拖拽的数据
         *函数参数 ：
         *函数返回值 ：        
         ***********************************************************************************************/
		_nulling: function() {
			rootEl =
			dragEl =
			parentEl =
			ghostEl =
			nextEl =
			cloneEl =
			lastDownEl =

			scrollEl =
			scrollParentEl =

			tapEvt =
			touchEvt =

			moved =
			newIndex =

			lastEl =
			lastCSS =

			putSortable =
			activeGroup =
			Sortable.active = null;

			savedInputChecked.forEach(function (el) {
				el.checked = true;
			});
			savedInputChecked.length = 0;
		},

        /***********************************************************************************************
         *函数名 ：handleEvent
         *函数功能描述 ： 为事件绑定this的时候提供该事件，判断是否在拖拽还是拖拽结束，调用对应的函数
         *函数参数 ：
          evt:
          类型：object，事件类型 拖拽的事件类型         
         ***********************************************************************************************/
        handleEvent: function (/**Event*/evt) {
			switch (evt.type) {
				case 'drop':
				case 'dragend':
					this._onDrop(evt);
					break;

				case 'dragover':
				case 'dragenter':
					if (dragEl) {
						this._onDragOver(evt);
						_globalDragOver(evt);
					}
					break;

				case 'selectstart':
					evt.preventDefault();
					break;
			}
		},
        		
        /***********************************************************************************************
         *函数名 ：toArray   
         *函数功能描述 ：获取dom节点的 data-id 的属性，如果没有则会调用_generateId函数生成唯一表示符 
         *函数参数 ： viod 
         *函数返回值 ： 类型：array 生成唯一标识符的id数组         
         ***********************************************************************************************/
		toArray: function () {
			var order = [],
				el,
				children = this.el.children,
				i = 0,
				n = children.length,
				options = this.options;

			for (; i < n; i++) {
				el = children[i];
				if (_closest(el, options.draggable, this.el)) {
					order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
				}
			}

			return order;
		},

		/**
		 * Sorts the elements according to the array.
		 * @param  {String[]}  order  order of the items
		 */
        /***********************************************************************************************
         *函数名 ：sort   
         *函数功能描述 ： 删除含有这个id的子节点 删除他，让他重新排序，从栈底部插入数据
         *函数参数 ： order：类型：array， 数组id  
         *函数返回值 ： void         
         ***********************************************************************************************/
		sort: function (order) {
			var items = {}, rootEl = this.el;

			this.toArray().forEach(function (id, i) {
				var el = rootEl.children[i];

				if (_closest(el, this.options.draggable, rootEl)) {
					items[id] = el;
				}
			}, this);

			order.forEach(function (id) {
				if (items[id]) {
					rootEl.removeChild(items[id]);
					rootEl.appendChild(items[id]);
				}
			});
		},
        
		/**
		 * 保存排序
		 */
		save: function () {
			var store = this.options.store;
			store && store.set(this);
		},
		
        /***********************************************************************************************
         *函数名 ：_closest
         *函数功能描述 ： 用来调节节点、匹配节点、匹配calss、匹配触发dom，该函数的dom节点中的tag或者class，selector参数可以是tag或者class或者>*，
         如果是>* 并且当前的父节点和ctx 参数相同，则不需要匹配直接返回el，如果是tag或者class则匹配。
         *函数参数 ：
          el：
           类型:obj，拖拽节点dom
          selector：
           类型：字符串，如果selector是'li' : '>*'则返回是改节点dom，还有如果selector是和当前拖拽节点的name相同则也返回改节点dom，还有匹配触发该函数的el中的class是否是和参数中selector相同，相同则返回true，否则返回null    
         *函数返回值 ：dom和null         
         ***********************************************************************************************/
		closest: function (el, selector) {
			return _closest(el, selector || this.options.draggable, this.el);
		},
		
        /***********************************************************************************************
         *函数名 ：option
         *函数功能描述 ： 获取option对象中的某个参数，或者设置option对象中的某个参数  
         *函数参数 ：name：
           类型：string， option的key，    
          value：类型：string， 设置option的值    
         *函数返回值 ： viod
         ***********************************************************************************************/
		option: function (name, value) {
			var options = this.options;

			if (value === void 0) {
				return options[name];
			} else {
				options[name] = value;

				if (name === 'group') {
					_prepareGroup(options);
				}
			}
		},

		/***********************************************************************************************
         *函数名 ：destroy
         *函数功能描述 ：清空拖拽事件，和清空拖拽列表dom节点，销毁拖拽 。  
         *函数参数 viod
         *函数返回值 ： viod         
         ***********************************************************************************************/
		destroy: function () {
			var el = this.el;

			el[expando] = null;

			_off(el, 'mousedown', this._onTapStart);
			_off(el, 'touchstart', this._onTapStart);
			_off(el, 'pointerdown', this._onTapStart);

			if (this.nativeDraggable) {
				_off(el, 'dragover', this);
				_off(el, 'dragenter', this);
			}

			// Remove draggable attributes
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
				el.removeAttribute('draggable');
			});

			touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

			this._onDrop();

			this.el = el = null;
		}
	};
	
	//删除某个类
	function removeElementsByClass(className){
	    var elements = document.getElementsByClassName(className);
	    while(elements.length > 0){
	        elements[0].parentNode.removeChild(elements[0]);
	    }
	}

    /***********************************************************************************************
     *函数名 ：_cloneHide
     *函数功能描述 ： 设置克隆的节点隐藏显示，是否添加到页面
     *函数参数 ： 
      state：
       类型:Boolean 真，假
     *函数返回值 ： viod     
     ***********************************************************************************************/
	function _cloneHide(sortable, state) {
		if (sortable.lastPullMode !== 'clone') {
			state = true;
		}

		if (cloneEl && (cloneEl.state !== state)) {
			_css(cloneEl, 'display', state ? 'none' : '');

			if (!state) {
				if (cloneEl.state) {
					if (sortable.options.group.revertClone) {
						rootEl.insertBefore(cloneEl, nextEl);
						sortable._animate(dragEl, cloneEl);
					} else {
						rootEl.insertBefore(cloneEl, dragEl);
					}
				}
			}

			cloneEl.state = state;
		}
	}

    /***********************************************************************************************
     *函数名 ：_closest
     *函数功能描述 ： 匹配触发dom该函数的dom节点中的tag或者class，selector参数可以是tag或者class或者>*，
     如果是>* 并且当前的父节点和ctx 参数相同 则不需要匹配直接返回el，如果是tag或者class则匹配
     *函数参数 ：
      el：
       类型:obj，拖拽节点dom
      selector：
       类型：字符串，如果selector是'li' : '>*'则返回是改节点dom，还有如果selector是和当前拖拽节点的name相同则也返回改节点dom，还有匹配触发该函数的el中的class是否是和参数中selector相同，相同则返回true，否则返回null
      ctx：ctx用来匹配当前selector的父节点是否等于ctx节点 
     *函数返回值 ：dom和null    
     ***********************************************************************************************/
	function _closest(/**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx) {
		if (el) {
			ctx = ctx || document;

			do {
				if ((selector === '>*' && el.parentNode === ctx) || _matches(el, selector)) {
					return el;
				}
				/* jshint boss:true */
			} while (el = _getParentOrHost(el));
		}

		return null;
	}

	function _getParentOrHost(el) {
		var parent = el.host;

		return (parent && parent.nodeType) ? parent : el.parentNode;
	}

    /*
    *函数名 ：_globalDragOver
    *函数功能描述 ：设置拖动的元素移动到放置目标。
    *参数说明：evt：类型obj事件对象
    返回值：void
    */
	function _globalDragOver(/**Event*/evt) {	    
		if (evt.dataTransfer) {
			evt.dataTransfer.dropEffect = 'move';
		}
		evt.preventDefault();
	}

    /*
    *函数名 ：_on
    *函数功能描述 ： 事件绑定
    *参数说明：
     el：类型DOM节点， 
     name：类型string，事件类型
     fn：类型：function，需要绑定的函数
    */
	function _on(el, event, fn) {
		el.addEventListener(event, fn, captureMode);
	}

    /*
     *函数名 ：_off
     *函数功能描述 ： 添加删除calss
     *参数说明：
      el：类型DOM节点， 需要添加和删除的dom节点，
      name：类型string，需要添加删除class字符串的
      fn：类型：布尔值，如果是真则删除name的class名称否则添加
     */
	function _off(el, event, fn) {
		el.removeEventListener(event, fn, captureMode);
	}

    /*
     *函数名 ：_toggleClass
     *函数功能描述 ： 根据第三个参数布尔值决定是添加或删除calss样式名
     *参数说明：
      el：类型DOM节点， 需要添加和删除的dom节点，
      name：类型string，需要添加删除class字符串的
      state：类型：布尔值，如果是真则删除name的class名称否则添加
     */
	function _toggleClass(el, name, state) {
		if (el) {
			if (el.classList) {
				el.classList[state ? 'add' : 'remove'](name);
			}
			else {
				var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
				el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
			}
		}
	}

    /*
     *函数名 ：设置 样式 与 获取dom节点的style属性
     *函数功能描述 ： 添加删除calss,获取dom节点全部css属性，如果是一个参数的时候将返回该dom节点的全部css属性，如果是两个参数的时候该返回该css的第二个参数的值，如果是三个参数的话将设置css样式
     *参数说明：
      el：类型DOM节点， 需要添加和删除的dom节点，
      prop：类型string，需要添加删除class字符串的那么
      val：类型：布尔值，如果是真则删除name的class名称否则添加
     */
	function _css(el, prop, val) {
		var style = el && el.style;

		if (style) {
			if (val === void 0) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					val = document.defaultView.getComputedStyle(el, '');
				}
				else if (el.currentStyle) {
					val = el.currentStyle;
				}

				return prop === void 0 ? val : val[prop];
			}
			else {
				if (!(prop in style)) {
					prop = '-webkit-' + prop;
				}

				style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}

    /***********************************************************************************************
     *函数名 ：_find
     *函数功能描述 ： 获取拖拽节点下面的所有a和img标签，并且设置他们禁止拖拽行为
     *函数参数 ：
      ctx：
      类型：dom-obj 拖拽的节点
      tagName：
       类型：string，ctx.getElementsByTagName(tagName) 
       获取拖拽节点下面的所有a和img
     *函数返回值 ： a和img的dom集合 
     ***********************************************************************************************/
	function _find(ctx, tagName, iterator) {
		if (ctx) {
			var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;

			if (iterator) {
				for (; i < n; i++) {
					iterator(list[i], i);
				}
			}

			return list;
		}

		return [];
	}

    /***********************************************************************************************
     *函数名 ：_dispatchEvent
     *函数功能描述 ： 创建一个事件，事件参数主要由name 提供，并且触发该事件，其实就是模拟事件并且触发该事件 
     *函数参数 ：
      sortable：
      类型： obj sortable
      rootEl：
       类型： dom-obj 鼠标按下去拖拽节点的根节点    
      name： 类型： string 需要创建的事件   
      targetEl：dom-obj 鼠标按下去拖拽节点，触屏到发生事件ondragover的节点的根节点，就是目标节点的根节点。但是如果是start事件的时候传进来的改参数就是鼠标按下去拖拽节点的根节点   
      fromEl：
       类型： dom-obj 鼠标按下去拖拽节点的根节点 参数和第二个一样，为什么重写参数进来呢，可能是为了兼容这样的的吧  
      startIndex：
        类型： number 鼠标按下去拖拽节点的索引
      newIndex： 
       类型： number   
     * *函数返回值 ： 
     ***********************************************************************************************/
	function _dispatchEvent(sortable, rootEl, name, targetEl, fromEl, startIndex, newIndex) {
		sortable = (sortable || rootEl[expando]);
		var evt = document.createEvent('Event'),
			options = sortable.options,
			onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);//将事件第一个字母大写，重新组装事件名称，如：将choose改成onChoose

		evt.initEvent(name, true, true);

		evt.to = rootEl;
		evt.from = fromEl || rootEl;
		evt.item = targetEl || rootEl;
		evt.clone = cloneEl;

		evt.oldIndex = startIndex;
		evt.newIndex = newIndex;

		rootEl.dispatchEvent(evt);//给节点分派一个合成事件。

		if (options[onName]) {
			options[onName].call(sortable, evt);
		}
	}

    /***********************************************************************************************
     *函数名 ：_onMove
     *函数功能描述 ： 移动事件
     *函数参数 ： 
      fromEl：
      类型：obj，拖拽的根节点
      toEl：
      类型：obj，拖拽的根节点
      dragEl：
      类型：obj，拖拽的节点
      dragRect：
      类型：obj，拖拽的节点rect
      targetEl：
      类型：obj，目标节点 ondragover 发生事件的节点
      targetRect：
      类型：obj，目标节点rect
     *函数返回值 ： retVal 
     ***********************************************************************************************/
	function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt, willInsertAfter) {	    
	    var evt,
			sortable = fromEl[expando],
			onMoveFn = sortable.options.onMove,
			retVal;

		evt = document.createEvent('Event');
		evt.initEvent('move', true, true);

		evt.to = toEl;
		evt.from = fromEl;
		evt.dragged = dragEl;
		evt.draggedRect = dragRect;
		evt.related = targetEl || toEl;
		evt.relatedRect = targetRect || toEl.getBoundingClientRect();
		evt.willInsertAfter = willInsertAfter;		
		fromEl.dispatchEvent(evt);		
		if (onMoveFn) {		   
			retVal = onMoveFn.call(sortable, evt, originalEvt);
		}

		return retVal;
	}

    /***********************************************************************************************
     *函数名 ：_disableDraggable
     *函数功能描述 ： 禁用拖动，把heml5的拖拽属性设置为假
     *函数参数 ：viod
     *函数返回值 ：无     
     ***********************************************************************************************/
	function _disableDraggable(el) {
		el.draggable = false;
	}

    /***********************************************************************************************
     *函数名 ：_unsilent
     *函数功能描述 ： 将_silent 设置为假
     *函数参数 ：viod
     *函数返回值 ：无     
     ***********************************************************************************************/
	function _unsilent() {
		_silent = false;
	}

    /** @returns {HTMLElement|false} */
	/***********************************************************************************************
     *函数名 ：_ghostIsLast
     *函数功能描述 ： 判断节点是否是最后一个节点
     *函数参数 ：
	    el ：类型：dom，拖拽的根节点
	    evt：类型：obj，事件对象
     *函数返回值 ：      
     ***********************************************************************************************/
	function _ghostIsLast(el, evt) {
		var lastEl = el.lastElementChild,
			rect = lastEl.getBoundingClientRect();

		// 5 — min delta
		// abs — неьзя добавлять, а то равеен сверху
		return (evt.clientY - (rect.top + rect.height) > 5) ||
			(evt.clientX - (rect.left + rect.width) > 5);
	}

    /***********************************************************************************************
     *函数名 ：_generateId
     *函数功能描述 ： 根据tag的name和class，src，href，文本内容，来匹配生成唯一的标识符
     *函数参数 ： 
      el：dom节点
     *函数返回值 ：string     
     ***********************************************************************************************/
	function _generateId(el) {
		var str = el.tagName + el.className + el.src + el.href + el.textContent,
			i = str.length,
			sum = 0;

		while (i--) {
			sum += str.charCodeAt(i);
		}
		return sum.toString(36);
	}

    /***********************************************************************************************
     *函数名 ：_index
     *函数功能描述 ： 返回在其父范围内的元素的元素的索引
     *函数参数 ： 
       el
     *函数返回值 ：number 
     ***********************************************************************************************/
	function _index(el, selector) {
		var index = 0;
		if (!el || !el.parentNode) {
			return -1;
		}
		while (el && (el = el.previousElementSibling)) {
			if ((el.nodeName.toUpperCase() !== 'TEMPLATE') && (selector === '>*' || _matches(el, selector))) {
				index++;
			}
		}
		return index;
	}

    /***********************************************************************************************
     *函数名 ：_matches
     *函数功能描述 ： 匹配tag和tag，匹配clsss和tag，
     *函数参数 ：el： 类型:obj，当前拖拽节点dom
      selector:  类型：string, tag或者clasname   
     *函数返回值 ：类型：Boolean,真假，selector如果传递的是tag，则当前的el的tag和selector的tag要同样，或当前的el的class含有selector 中的calss则返回真，否则返回假     
     ***********************************************************************************************/
	function _matches(/**HTMLElement*/el, /**String*/selector) {
		if (el) {
			selector = selector.split('.');

			var tag = selector.shift().toUpperCase(),
				re = new RegExp('\\s(' + selector.join('|') + ')(?=\\s)', 'g');

			return (
				(tag === '' || el.nodeName.toUpperCase() == tag) &&
				(!selector.length || ((' ' + el.className + ' ').match(re) || []).length == selector.length)
			);
		}

		return false;
	}

    /***********************************************************************************************
     *函数名 ：_throttle
     *函数功能描述 ： 回调初始化一个函数 并且调用该回调函数
     *函数参数 ： 
      callback：类型:function，回调函数
      ms:类型：number, 毫秒   
     *函数返回值 ：
      类型：function，函数，可以用来声明一个函数作用     
     ***********************************************************************************************/
	function _throttle(callback, ms) {
		var args, _this;

		return function () {
			if (args === void 0) {
				args = arguments;
				_this = this;

				setTimeout(function () {
					if (args.length === 1) {
						callback.call(_this, args[0]);
					} else {
						callback.apply(_this, args);
					}

					args = void 0;
				}, ms);
			}
		};
	}

    /***********************************************************************************************
     *函数名 ：_extend
     *函数功能描述 ：类合并
     *函数参数 ： 
      dst：类型：obj，子类 
      src：类型：obj，父类 
     *函数返回值 ： dst 子类
     ***********************************************************************************************/
	function _extend(dst, src) {
		if (dst && src) {
			for (var key in src) {
				if (src.hasOwnProperty(key)) {
					dst[key] = src[key];
				}
			}
		}

		return dst;
	}

	function _clone(el) {
		return $
			? $(el).clone(true)[0]
			: (Polymer && Polymer.dom
				? Polymer.dom(el).cloneNode(true)
				: el.cloneNode(true)
			);
	}

	function _saveInputCheckedState(root) {
		var inputs = root.getElementsByTagName('input');
		var idx = inputs.length;

		while (idx--) {
			var el = inputs[idx];
			el.checked && savedInputChecked.push(el);
		}
	}

	// Fixed #973: 
	_on(document, 'touchmove', function (evt) {	    
		if (Sortable.active) {
			evt.preventDefault();
		}
	});

	try {
		window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
			get: function () {
				captureMode = {
					capture: false,
					passive: false
				};
			}
		}));
	} catch (err) {}

	// Export utils
	Sortable.utils = {
		on: _on,
		off: _off,
		css: _css,
		find: _find,
		is: function (el, selector) {
			return !!_closest(el, selector, el);
		},
		extend: _extend,
		throttle: _throttle,
		closest: _closest,
		toggleClass: _toggleClass,
		clone: _clone,
		index: _index
	};  
	
    /***********************************************************************************************
     *函数名 ：Sortable.create
     *函数功能描述 ：在类Sortable中添加多个一个方法，而调用Sortable构造函数实例化给Sortable.create属性,创建了拖拽功能 
     *函数参数 ： 
      el：类型：obj，拖拽列表的dom节点
      options：类型：obj，拖拽的参数
     *函数返回值 ： dst 子类     
     ***********************************************************************************************/
	Sortable.create = function (el, options) {
		return new Sortable(el, options);
	};

	// Export
	Sortable.version = '1.6.0';
	return Sortable;
});

//绑定某个容器的拖动排序功能
function bindDragSort(obj){	
	var sortable = new Sortable(obj,{
		group : "tem",	//分组，相同组之间能相互拖拽
		animation: 150,	//动画参数
        delay:100,  //延迟拖拽
		delEvent:function(delObj){//删除按钮回调函数				
			delNode(delObj)	         
		},
		openLink:function(targetObj){//单击打开的回调函数
			alert("执行回调方法用来打开链接:"+targetObj.innerHTML);
			//openSource(targetObj);			
		},
	    // 对象被从另一个列表拖进列表中时发生
		onAdd: function(event){	
			//console.log("onAdd.items",[event.item , event.from]);
		},
	    //删除拖拽节点的时候促发该事件
		onRemove: function(event){	
			//console.log("onRemove.items",[event.item , event.from]);
		},
	    // 在列表中改变了排序时调用
		onUpdate: function(event){	
			//console.log("onUpdate.items",[event.item , event.from]);
		},
	    //开始拖拽触发该函数
		onStart: function(event){	
			//console.log("onStart.items",[event.item , event.from]);
		},
	    //任何列表中发生改变时被调用(add / update / remove)
		onSort: function(event){
			//console.log("onSort.items",[event.item , event.from]);
		},
	    //拖拽完毕之后发生该事件	
		onEnd: function(event){	
			sortEnd();//回调事件
//			var id_arr=''
//			for(var i=0, len=event.from.children.length; i<len; i++){
//			        id_arr+=','+ event.from.children[i].getAttribute('drag-id');
//			     }
//			id_arr=id_arr.substr(1);
			 //然后请求后台ajax 这样就完成了拖拽排序
			//console.log(id_arr);
		}
	});		
}

function bindDragSort2(obj) {
    var sortable = new Sortable(obj, {
        group: "tem",	//分组，相同组之间能相互拖拽
        animation: 150,	//动画参数
        disabled: false,//禁止拖动
        delay: 0 //延迟拖拽        
    });
}