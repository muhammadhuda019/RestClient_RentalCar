const baseUrl = "http://127.0.0.1:8000/api/";
const allEndPoin = `${baseUrl}MyRental`;

const contents = document.querySelector("#content-list");
const tableRows = document.querySelector("#tableBody");
const title = document.querySelector(".card-title");

function getAllMobil() {
    title.innerHTML = "Daftar Mobil";

    fetch(allEndPoin)
        .then(response => response.json())
        .then(resJson => {
            let datas = "";
            resJson.data.forEach(data => {
                datas += `
                    <tr>
                        <td>${data.kode_mobil}</td>
                        <td>${data.plat_nomer}
                        <td>${data.nama_mobil}</td>
                        <td>${data.type}</td>
                        <td>Rp.${data.harga_sewa}</td>                        
                        <td>
                            <a onclick="editMobil(${data.kode_mobil})" class="waves-effect waves-light btn-small">
                                <i class="material-icons">create</i>
                            </a>
                            <a onclick="deleteMobil(${data.kode_mobil})" class="waves-effect waves-light btn-small red">
                                <i class="material-icons">delete</i>
                            </a>
                        </td>
                    </tr>`
            });
            tableRows.innerHTML = `${datas}`;
        }).catch(err => {
            console.error(err);
        })
}

function getMobilByType(tipeMobil) {
    title.innerHTML = `Daftar Mobil ${tipeMobil}`;
    fetch(allEndPoin)
        .then(response => response.json())
        .then(resJson => {
            let datas = "";
            resJson.data.forEach(data => {
                if(data.jenis == tipeMobil) {
                datas += `
                    <tr>
                        <td>${data.kode_mobil}</td>
                        <td>${data.plat_nomer}
                        <td>Mobil ${data.nama_mobil}</td>
                        <td>Rp.${data.type}</td>
                        <td>Rp.${data.harga_sewa}</td>
                        <td>
                            <a onclick="editMobil(${data.kode_mobil})" class="waves-effect waves-light btn-small blue">
                                <i class="material-icons">create</i>
                            </a>
                            <a onclick="deleteMobil(${data.kode_mobil})" class="waves-effect waves-light btn-small orange">
                                <i class="material-icons">delete</i>
                            </a>
                        </td>
                    </tr>`
                }
            });
            tableRows.innerHTML = `${datas}`;
        }).catch(err => {
            console.error(err);
        })
}

function saveData() {
    let methodRequest = 'POST';
    let kode_mobil = document.querySelector('#kode_mobilInput').value;
    let plat_nomer = document.querySelector('#plat_nomerInput').value;
    let nama_mobil = document.querySelector('#nama_mobilInput').value;
    let type = document.querySelector('#typeInput').value;
    let harga_sewa = document.querySelector('#harga_sewaInput').value;
    
    let url = '';

    if (kode_mobil.length > 0) {
        url = allEndPoin+'/update'+kode_mobil;
        methodRequest = 'PUT';
    }
    else url = allEndPoin;
    fetch(url, { 
            method: methodRequest,
            body: new URLSearchParams({
                    "kode_mobil": kode_mobil,
                    "plat_nomer": plat_nomer,
                    "nama_mobil": nama_mobil,
                    "type": type,
                    "harga_sewa": harga_sewa,                    
                }),
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
            } 
        })
        .then(response => response.json())
        .then(resJson => {
            if(resJson.status) {
                M.toast({html: resJson.message});
                cancelForm();
                refreshTable();

            } else {
                M.toast({html: resJson.message, classes: 'orange'});
            }

        }).catch(err => {
            console.error(err);
        })
}

function editMobil(kode_mobil) {
    fetch(allEndPoin+'/'+kode_mobil)
        .then(response => response.json())
        .then(resJson => {
            if(resJson.status) {
                console.log(resJson)
                    document.querySelector('#kode_mobilInput').value = resJson.data.kode_mobil;
                    document.querySelector('#plat_nomerInput').value = resJson.data.plat_nomer;
                    document.querySelector('#nama_mobilInput').value = resJson.data.nama_mobil;
                    document.querySelector('#typeInput').value = resJson.data.type;
                    document.querySelector('#harga_sewaInput').value = resJson.data.harga_sewa;
                    
                showForm();
                title.innerHTML = "Edit Data Mobil";

            } else {
                M.toast({html: resJson.message, classes: 'orange'});
            }
        }).catch(err => {
            console.error(err);
        })
}

function deleteMobil(kode_mobil) {
    fetch(allEndPoin +'/delete'+kode_mobil, { 
        method: 'DELETE',
        body: new URLSearchParams({
                "kode_mobil": kode_mobil,
            }),
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
        } 
    })
    .then(response => response.json())
    .then(resJson => {
        if(resJson.status) {
            M.toast({html: resJson.message});
            refreshTable();

        } else {
            M.toast({html: resJson.message, classes: 'orange'});
        }

    }).catch(err => {
        console.error(err);
    })
}

function hideForm() {
    title.innerHTML = "Daftar Mobil";
    document.querySelector('#formMobilWrapper').style.display = "none";
    document.querySelector('#btnAdd').style.display = "block";
    document.querySelector('#tabelMobil').style.display = "";
    document.querySelector('#kode_mobilInput').value = '';
}

function showForm() {
    title.innerHTML = "Tambah Data Mobil";
    document.querySelector('#formMobilWrapper').style.display = "block";
    document.querySelector('#btnAdd').style.display = "none";
    document.querySelector('#tabelMobil').style.display = "none";
}

function cancelForm() {
    title.innerHTML = "Daftar Mobil";
    document.querySelector('#formMobil').reset();
    document.querySelector('#kode_mobilInput').value = '';
    hideForm();
}

function refreshTable() {
    var page = window.location.hash.substr(1);
    if (page === "" || page === "!") page = "daftarMobil";
    loadPage(page);
}

function loadPage(page) {
    switch (page) {
        case "daftarMobil":
            getAllMobil();
            break;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    cancelForm();
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    document.querySelectorAll(".sidenav a, .topnav a").forEach(elm => {
        elm.addEventListener("click", evt => {
            let sideNav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sideNav).close();
            page = evt.target.getAttribute("href").substr(1);
            loadPage(page);
        })
    })
    var page = window.location.hash.substr(1);
    if (page === "" || page === "!") page = "daftarMobil";
    loadPage(page);
});