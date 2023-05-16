
var ordenarPorElo1v1 = false;

async function getPlayers() {
  const response = await fetch('players.json');
  const data = await response.json();
    return data;
}

function convertirUnixAFecha(unixNumero) {
  const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const fechaUnix = new Date(unixNumero * 1000);
  const formattedDate = fechaUnix.toLocaleDateString('es-ES', opciones);
  const fechaActual = new Date().toLocaleDateString('es-ES', opciones); //fecha de hoy

  const fecha1 = new Date(fechaActual.split('/').reverse().join('/'));
  const fecha2 = new Date(formattedDate.split('/').reverse().join('/'));
  const diffTime = Math.abs(fecha2 - fecha1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    var resultado = 'Hoy';
  } else if (diffDays === 1) {
    var resultado = 'Ayer';
  } else {
    var resultado = diffDays + ' días';
  }

  return resultado;
}


async function orderPlayers(tipoOrden) {
  const players = await getPlayers();
  const results = await Promise.all(players.map(fetchData));

  // Ordenar los jugadores por rating y ratingtg o ratingtg y rating
  results.sort((a, b) => {
    if (tipoOrden === true) {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      } else {
        return b.ratingtg - a.ratingtg;
      }
    } else {
      if (b.ratingtg !== a.ratingtg) {
        return b.ratingtg - a.ratingtg;
      } else {
        return b.rating - a.rating;
      }
    }
  });

  return results;
}



async function fetchData(player) {
  const response = await fetch(`https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=3&start=1&count=1&steam_id=${player.id_steam}`);
  const data = await response.json();
  const response2 = await fetch(`https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=4&start=1&count=1&steam_id=${player.id_steam}`);
  const data2 = await response2.json();
  const response3 = await fetch(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=3&count=1&steam_id=${player.id_steam}`);
  const data3 = await response3.json();
  const response4 = await fetch(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=4&count=1&steam_id=${player.id_steam}`);
  const data4 = await response4.json();

  
  return {
    steam_id: player.id_steam,
    puesto: 0,  
    name: data.leaderboard[0] ? data.leaderboard[0].name : data2.leaderboard[0] ? data2.leaderboard[0].name : player.nickname,
    profile_id: data.leaderboard[0] ? data.leaderboard[0].profile_id : data2.leaderboard[0] ? data2.leaderboard[0].profile_id : '',

    rating: data3[0] ? data3[0].rating : '',
    wins: data3[0] ? data3[0].num_wins : 0,
    losses: data3[0] ? data3[0].num_losses : 0,
    streak: data3[0] ? data3[0].streak : '',
    lastMatch: data3[0] ? data3[0].timestamp : 0,

    ratingtg: data4[0] ? data4[0].rating : '',
    winstg: data4[0] ? data4[0].num_wins : 0,
    lossestg: data4[0] ? data4[0].num_losses : 0,
    streaktg: data4[0] ? data4[0].streak : '',
    lastMatchtg: data4[0] ? data4[0].timestamp : 0
  };
}


// Agrega un escuchador de evento para el encabezado "Elo"
document.getElementById("elo").addEventListener("click", function () {
  if (ordenarPorElo1v1 === false){
    updateUI();
    var elotg = document.getElementById("elotg");
    var spans = elotg.getElementsByTagName("span");
    spans[1].style.color = "gray";
    var elo = document.getElementById("elo");
    var spans2 = elo.getElementsByTagName("span");
    spans2[1].style.color = "greenyellow";
    
  }
});

// Agrega un escuchador de evento para el encabezado "EloTG"
document.getElementById("elotg").addEventListener("click", function () {
  if (ordenarPorElo1v1 === true) {
    updateUI();
    var elotg = document.getElementById("elotg");
    var spans = elotg.getElementsByTagName("span");
    spans[1].style.color = "greenyellow";
    var elo = document.getElementById("elo");
    var spans2 = elo.getElementsByTagName("span");
    spans2[1].style.color = "gray";
  }
});


async function updateUI() {
  // Ordenar los jugadores
  ordenarPorElo1v1 = !ordenarPorElo1v1;
  const results = await orderPlayers(ordenarPorElo1v1);

  // Crear la tabla dinámicamente
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = '';

  results.forEach((result, index) => {
    const row = document.createElement('tr');
    const puesto = document.createElement('td');
    const name = document.createElement('td');
    const rating = document.createElement('td');
    const streak = document.createElement('td');
    const porcentaje = document.createElement('td');
    const lastMatch = document.createElement('td');
    const ratingtg = document.createElement('td');
    const streaktg = document.createElement('td');
    const porcentajetg = document.createElement('td');
    const lastMatchtg = document.createElement('td');

     //Añadir enlace al steam del jugador
    puesto.addEventListener('click', () => {
      window.open(`https://steamcommunity.com/profiles/${result.steam_id}`, '_blank');
    }); 
    puesto.style.cursor = "pointer";
    
    puesto.addEventListener('mouseover', () => {
      puesto.style.cursor = 'pointer';
      puesto.style.color = 'blue';
      puesto.style.textDecoration = 'underline';
    });

    puesto.addEventListener('mouseout', () => {
      puesto.style.cursor = 'default';
      puesto.style.color = 'black';
      puesto.style.textDecoration = 'none';
    });

    //Añadir enlace al aoe2 del jugador
    name.addEventListener('click', () => {
      window.open(`https://aoe2.net/#aoe2de-profile-${result.profile_id}`, '_blank');
    });
    name.style.cursor = "pointer";

    name.addEventListener('mouseover', () => {
      name.style.cursor = 'pointer';
      name.style.color = 'blue';
      name.style.textDecoration = 'underline';
    });

    name.addEventListener('mouseout', () => {
      name.style.cursor = 'default';
      name.style.color = 'black';
      name.style.textDecoration = 'none';
    });


    puesto.textContent = index + 1;
    name.textContent = result.name;

    rating.textContent = result.rating;
    streak.textContent = result.streak;
    let totalPartidas = result.wins + result.losses;
    if (totalPartidas > 0){
        porcentaje.textContent = Math.floor(((result.wins) / ((totalPartidas))) * 100) + " %";
        lastMatch.textContent = convertirUnixAFecha(result.lastMatch);
    }
    
    ratingtg.textContent = result.ratingtg;
    streaktg.textContent = result.streaktg;
    let totalPartidastg = result.winstg + result.lossestg;
    if (totalPartidastg > 0) {
      porcentajetg.textContent = Math.floor(((result.winstg) / ((totalPartidastg))) * 100) + " %";
        lastMatchtg.textContent = convertirUnixAFecha(result.lastMatchtg);
    }
    
    row.appendChild(puesto);
    row.appendChild(name);
    row.appendChild(rating);
    row.appendChild(streak);
    row.appendChild(porcentaje);
    row.appendChild(lastMatch);
    row.appendChild(ratingtg);
    row.appendChild(streaktg);
    row.appendChild(porcentajetg);
    row.appendChild(lastMatchtg);
    tableBody.appendChild(row);
  });

  
}

/* document.addEventListener('DOMContentLoaded', function() {
  updateUI();
} 
);*/