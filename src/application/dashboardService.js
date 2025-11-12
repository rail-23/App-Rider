import repo from '../infrastructure/firestoreRepository';

function computeByCategory(users) {
  const byCat = {};
  users.forEach(u => {
    const cat = u.Categoria || 'sin_categoria';
    byCat[cat] = (byCat[cat] || 0) + 1;
  });
  return byCat;
}

function computeByHour(users) {
  const byHour = {};
  users.forEach(u => {
    let date = null;
    if (u.createdAt && u.createdAt.toDate) date = u.createdAt.toDate();
    else if (u.createdAt instanceof Date) date = u.createdAt;
    if (date) {
      const hour = date.getHours();
      byHour[hour] = (byHour[hour] || 0) + 1;
    }
  });
  return byHour;
}

export async function getDashboardData() {
  const users = await repo.fetchUsers();
  const cupos = await repo.fetchCupos();

  const totalUsers = users.length;
  const usersByCategory = computeByCategory(users);
  const usersByHour = computeByHour(users);

  let sumM = 0, sumT = 0, sumN = 0;
  cupos.forEach(c => {
    sumM += Number(c.Manana) || 0;
    sumT += Number(c.Tarde) || 0;
    sumN += Number(c.Noche) || 0;
  });

  const totalCupos = { Manana: sumM, Tarde: sumT, Noche: sumN, total: sumM + sumT + sumN };

  const recentUsers = users.slice().sort((a,b) => {
    const ad = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate().getTime() : 0;
    const bd = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate().getTime() : 0;
    return bd - ad;
  }).slice(0,5);

  const recentCupos = cupos.slice().sort((a,b) => {
    const at = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate().getTime() : 0;
    const bt = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate().getTime() : 0;
    return bt - at;
  }).slice(0,5);

  return {
    totalUsers,
    usersByCategory,
    usersByHour,
    totalCupos,
    recentUsers,
    recentCupos,
  };
}

export default { getDashboardData };
