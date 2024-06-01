function mathmlImg() {
	var ps = document.getElementsByTagName('p');
	var divs = document.getElementsByTagName('div');
		for(var i =0; i < ps.length; i++) {
		    var p1 = ps[i];
		    if(p1.className === 'hiddenClass') {
		        p1.className = 'showClass';	            
		    }
		}
		 for(var i=0; i < divs.length; i++) {
		    var s1 = divs[i];
		    if(s1.className === 'showClass') {
		            s1.className = 'hiddenClass';            
		    }
		}
}