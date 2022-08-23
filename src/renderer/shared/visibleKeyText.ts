export const visibleKeyText = (original: string) => {
  let visible = original;

  visible = visible.replace('_NAT_', ' ');
  visible = visible.replace('_SHARP_', '♯ ');
  visible = visible.replace('_FLAT_', '♭ ');
  visible = visible.replace('MAJ', ' Maj ');
  visible = visible.replace('MIN', ' min ');

  return visible;
};
