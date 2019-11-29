export const judgeIsSupportFull = () => {
    let result = false;
    let element = document.getElementsByClassName(
        "ant-modal-content" //modal的class是ant-modal-wrap
      )[0]
    //let element = document.documentElement;
    try {
       //IE 10及以下ActiveXObject
    if (typeof  window.ActiveXObject !=undefined ) {
        result = true;
      } 
       //HTML W3C 提议
    else if (element.requestFullScreen) {
        result = true;
      }
      //IE11
      else if (element.msRequestFullscreen) {
        result = true;
      }
      // Webkit (works in Safari5.1 and Chrome 15)
      else if (element.webkitRequestFullScreen) {
        result = true;
      }
      // Firefox (works in nightly)
      else if (element.mozRequestFullScreen) {
        result = true;
      }
    } catch (error) {
        console.log(error)
    }
    
   
  
    return result;
  };
  //显示全屏
  export const fullScreen = () => {
    let element = document.getElementsByClassName(
        "ant-modal-content" //modal的class是ant-modal-wrap
      )[0]
    //let element = document.documentElement;
   
    //IE 10及以下ActiveXObject
    if (typeof  window.ActiveXObject !=undefined) {
      console.log("IE 10及以下ActiveXObject");
      try{
    //   let WsShell = new ActiveXObject("WScript.Shell");
    //   WsShell.SendKeys("{F11}");
      }catch(err){}
    
    }
    //HTML W3C 提议
   if (element.requestFullScreen) {
      console.log("HTML W3C 提议");
      element.requestFullScreen();
    }
    //IE11
    else if (element.msRequestFullscreen) {
      console.log("IE11");
      element.msRequestFullscreen();
    }
    // Webkit (works in Safari5.1 and Chrome 15)
    else if (element.webkitRequestFullScreen) {
      console.log("Webkit");
      element.webkitRequestFullScreen();
    }
    // Firefox (works in nightly)
    else if (element.mozRequestFullScreen) {
      console.log("Firefox");
      element.mozRequestFullScreen();
    }
  };
  //退出全屏
  export const fullExit = () => {
    var de = document;
    try{
        if(!de.fullscreen){
            return
        }
    if (de.exitFullscreen) {
      de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
      de.webkitCancelFullScreen();
    }
    }catch(err){}

  };
  