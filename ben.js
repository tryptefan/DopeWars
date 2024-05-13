// let fsButton = document.getElementById("fullscreenButton");
// let app = document.documentElement; // Use document.documentElement to access the root element (usually <html>)

// fsButton.addEventListener("click", () => {
//      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

//      if (!fullscreenElement) {
//           if (app.requestFullscreen) {
//                app.requestFullscreen();
//           } else if (app.webkitRequestFullscreen) {
//                app.webkitRequestFullscreen();
//           }
//      } else {
//           if (document.exitFullscreen) {
//                document.exitFullscreen();
//           } else if (document.webkitExitFullscreen) {
//                document.webkitExitFullscreen();
//           }
//      }
// });

// Move your fullscreen check into its own function
function isFullScreen() {
     return Boolean(
          document.fullscreenElement ||
               document.webkitFullscreenElement ||
               document.mozFullScreenElement ||
               document.msFullscreenElement
     );
}

// Make DoFullScreen() reusable by passing the element as a parameter
function DoFullScreen(el) {
     // Use a guard clause to exit out of the function immediately
     if (isFullScreen()) return false;
     // Set a default value for your element parameter
     if (el === undefined) el = document.documentElement;
     // Test for the existence of document.fullscreenEnabled instead of requestFullscreen()
     if (document.fullscreenEnabled) {
          el.requestFullscreen();
     } else if (document.webkitFullscreenEnabled) {
          el.webkitRequestFullscreen();
     } else if (document.mozFullScreenEnabled) {
          el.mozRequestFullScreen();
     } else if (document.msFullscreenEnabled) {
          el.msRequestFullscreen();
     }
}

(function () {
     const btnFullscreenContent = document.querySelector(".fsButton");
     const el = document.querySelector(".fs");
     // Request the .fullscreen-content element go into fullscreen mode
     btnFullscreenContent.addEventListener(
          "click",
          function () {
               DoFullScreen(el);
          },
          false
     );
})();
