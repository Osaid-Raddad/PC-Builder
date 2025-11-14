export const openSidebar = () => {
  const event = new Event('openSidebar');
  window.dispatchEvent(event);
};
