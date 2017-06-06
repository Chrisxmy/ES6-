   let dom = {
      on:function(element,type,selector,fn){
           element.addEventListener(type, e => {
                   let el = e.target
				   while(!el.matches(selector)){
					   if(el === element){
                            el = null
							break
					   }
					   el = el.parentNode
				   }
				   el && fn.call(null,el)
		   })
	  },

	  index:function(element){
             let siblings = element.parentNode.children
			 for( let index = 0 ; index<siblings.length ; index++){
				 if(siblings[index] === element){
					 return index
				 }
			 }
	  },

	    uniqueClass: function(element, className) {
              dom.every(element.parentNode.children, el => {
                el.classList.remove(className)
              })
              element.classList.add(className)
              return element
            },

            every: function(nodeList, fn) {
              for (var i = 0; i < nodeList.length; i++) {
                fn.call(null, nodeList[i])
              }
            },
           onSwipe: function(element, fn) {
              let x0, y0
              element.addEventListener('touchstart', function(e) {
                x0 = e.touches[0].clientX           
                y0 = e.touches[0].clientY
              })
              element.addEventListener('touchmove', function(e) {
                if (!x0 || !y0) {
                  return
                }
                let xDiff = e.touches[0].clientX - x0
                let yDiff = e.touches[0].clientY - y0
                if (Math.abs(xDiff) > Math.abs(yDiff)) {
                     return
                } else {
                  if (yDiff > 0) {
                    fn.call(element, e, 'down')
                  } else {
                    fn.call(element, e, 'up')
                  }
                }
                x0 = undefined
                y0 = undefined
              })
            },



   }