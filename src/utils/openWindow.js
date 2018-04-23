/**
 *Created by jiachenpan on 16/11/29.
 * @param {Sting} url
 * @param {Sting} title
 * @param {Number} w
 * @param {Number} h
 */

/**
 * openWindow
 */
export default function openWindow(url, title, w, h) {
  // Fixes dual-screen position                            Most browsers       Firefox
  // 屏幕左边距离
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
  // 顶部距离
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top
  // 窗口宽度
  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
  // 窗口高度
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

  const left = ((width / 2) - (w / 2)) + dualScreenLeft
  const top = ((height / 2) - (h / 2)) + dualScreenTop
  // 设定新开窗口的大小尺寸
  const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}

