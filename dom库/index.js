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
            }



   }