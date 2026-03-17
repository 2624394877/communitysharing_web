export const getDeviceType = () => {
  const ua = navigator.userAgent;

  const isMobile = /Android|iPhone|iPod/i.test(ua);

  return isMobile ? 'mobile' : 'pc';
};