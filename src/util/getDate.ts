export default function parseDate(tdate: string) {
  const created = new Date(Date.parse(tdate));
  const now = new Date();
  const diff = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (diff <= 1) {
    return '방금 전';
  }
  if (diff < 20) {
    return diff + ' 초 전';
  }
  if (diff < 40) {
    return '30초 전';
  }
  if (diff < 60) {
    return '1 분 미만';
  }
  if (diff <= 90) {
    return '1 분 전';
  }
  if (diff <= 3540) {
    return Math.round(diff / 60) + '분 전 ';
  }
  if (diff <= 5400) {
    return '1 시간 전';
  }
  if (diff <= 86400) {
    return Math.round(diff / 3600) + '시간 전';
  }
  if (diff <= 129600) {
    return '1일 전';
  }
  if (diff < 604800) {
    return Math.round(diff / 86400) + '일 전';
  }
  if (diff <= 777600) {
    return '1 주 전';
  }
  const month = created.toLocaleDateString('default', { month: 'long' });
  return `${month.length === 3 ? month.slice(0, 2) : month.slice(0, 1)}달 전`;
}
