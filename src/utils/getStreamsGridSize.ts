export function getStreamsGridSize(
  items: number,
  isDesktop: boolean = true,
  containerSize: { width: number; height: number },
) {
  const getColumns = () => {
    if (isDesktop) {
      if (items === 1) return 1;
      if (items >= 2 && items <= 6) return 2;
    } else {
      if (items <= 3) return 1;
      if (items >= 4 && items <= 6) return 2;
    }

    if (items >= 7 && items <= 12) return 3;
    if (items >= 13 && items <= 20) return 4;
    if (items >= 21 && items <= 30) return 6;
    if (items >= 31 && items <= 35) return 7;

    return 8;
  };

  const columns = getColumns();

  // console.log('> columns', columns);

  const rows = Math.ceil(items / columns);

  // console.log('> rows', rows);

  // console.log('> height', containerSize.height / rows);

  return {
    height: Math.floor((containerSize.height * 0.98) / rows),
    width: Math.floor((containerSize.width * 0.98) / columns),
    rows,
    columns,
  };
}
