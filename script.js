const CLIENT_ID = " ";
const CLIENT_SECRET = " ";
const AUTH_URL = "https://accounts.spotify.com/api/token";
const API_URL = "https://api.spotify.com/v1/";

document.getElementById("searchButton").addEventListener("click", searchArtist);

async function getToken() {
    const response = await fetch(AUTH_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET)
        },
        body: "grant_type=client_credentials"
    });
    const data = await response.json();
    return data.access_token;
}

async function searchArtist() {
    const artistName = document.getElementById("artistInput").value;
    const token = await getToken();
    const response = await fetch(API_URL + "search?q=" + encodeURIComponent(artistName) + "&type=artist", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    const data = await response.json();
    const artist = data.artists.items[0];
    if (artist) {
        document.getElementById("artistResults").innerHTML = `
            <h2> Artista: ${artist.name}</h2>
            <img src="${artist.images[0].url}" alt="${artist.name}" class="img-1">
            <div class= "um"> 
            <button onclick="searchSongs('${artist.id}')" class= "bt">Ver as top músicas</button>
            <button onclick="displayAlbums('${artist.id}') " class= "bt">Mostrar álbuns</button>
            </div>
            
            `;
            document.getElementById("artistInput").value = "";

    } else {
        document.getElementById("artistResults").innerHTML = "Artist not found";
    }
}

async function searchSongs(artistId) {
    const token = await getToken();
    const response = await fetch(API_URL + "artists/" + artistId + "/top-tracks?country=US", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    const data = await response.json();
    const tracks = data.tracks;
    let output = "";
    
    tracks.forEach(track => {
        output += `
            <div class= "grid-container">
                <img src="${track.album.images[0].url}" alt="${track.album.name}">
                <p>Música: <strong> ${track.name}</strong> </p>
                <p>Duração: ${msToMinutesAndSeconds(track.duration_ms)}</p>
            </div>
        `;

        document.querySelector(".topSongsHeader").classList.remove("hide")
        document.querySelector(".topSongsHeader2").classList.add("hide")
    });
    document.getElementById("albumResults").innerHTML = output;
}

async function displayAlbums(artistId) {
    const token = await getToken();
    const response = await fetch(API_URL + "artists/" + artistId + "/albums?limit=25", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    const data = await response.json();
    const albums = data.items;
    let output = "";
    albums.forEach(album => {
        output += `
            <div class= "grid-container">
                <img src="${album.images[0].url}" alt="${album.name}">
                <p> Nome do lançamento: <strong>${album.name} </strong></p>
                <p> Data de lançamento: <strong>${album.release_date}</strong></p>
            </div>
        `;
        document.querySelector(".topSongsHeader2").classList.remove("hide")
        document.querySelector(".topSongsHeader").classList.add("hide")
    }
    );
    
    document.getElementById("albumResults").innerHTML = output;
}

function msToMinutesAndSeconds(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
