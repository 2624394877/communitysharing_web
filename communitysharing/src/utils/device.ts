export const getDeviceType = () => {
  const ua = navigator.userAgent;

  const isMobile = /Android|iPhone|iPod/i.test(ua);

  return isMobile ? 'mobile' : 'pc';
}; // 直接使用uniapp开发App端，web页面不需要这个