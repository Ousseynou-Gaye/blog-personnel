const BASE_URL = "http://localhost:5000/api";

// Fonction utilitaire pour les headers
function getHeaders(withAuth = false) {
    const headers = { "Content-Type": "application/json" };
    if (withAuth) {
        const token = localStorage.getItem("token");
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

// ==================== AUTH ====================

export async function registerUser(nom_complet, username, password) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ nom_complet, username, password })
    });
    return response.json();
}

export async function loginUser(username, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ username, password })
    });
    return response.json();
}

// ==================== ARTICLES ====================

export async function getArticles() {
    const response = await fetch(`${BASE_URL}/articles`, {
        method: "GET",
        headers: getHeaders(true)
    });
    return response.json();
}

export async function getArticle(id) {
    const response = await fetch(`${BASE_URL}/articles/${id}`, {
        method: "GET",
        headers: getHeaders(true)
    });
    return response.json();
}

export async function creerArticle(titre, contenu, est_public, commentaires_actives) {
    const response = await fetch(`${BASE_URL}/articles`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({ titre, contenu, est_public, commentaires_actives })
    });
    return response.json();
}

export async function modifierArticle(id, titre, contenu, est_public, commentaires_actives) {
    const response = await fetch(`${BASE_URL}/articles/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify({ titre, contenu, est_public, commentaires_actives })
    });
    return response.json();
}

export async function supprimerArticle(id) {
    const response = await fetch(`${BASE_URL}/articles/${id}`, {
        method: "DELETE",
        headers: getHeaders(true)
    });
    return response.json();
}
// ==================== AMIS ====================

export async function rechercherUtilisateur(username) {
    const response = await fetch(`${BASE_URL}/amis/rechercher?username=${username}`, {
        method: "GET",
        headers: getHeaders(true)
    });
    return response.json();
}

export async function envoyerDemandeAmi(ami_id) {
    const response = await fetch(`${BASE_URL}/amis/demande`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({ ami_id })
    });
    return response.json();
}

export async function getDemandesRecues() {
    const response = await fetch(`${BASE_URL}/amis/demandes`, {
        method: "GET",
        headers: getHeaders(true)
    });
    return response.json();
}

export async function accepterDemande(demande_id) {
    const response = await fetch(`${BASE_URL}/amis/demande/${demande_id}/accepter`, {
        method: "PUT",
        headers: getHeaders(true)
    });
    return response.json();
}

export async function refuserDemande(demande_id) {
    const response = await fetch(`${BASE_URL}/amis/demande/${demande_id}/refuser`, {
        method: "PUT",
        headers: getHeaders(true)
    });
    return response.json();
}

export async function getAmis() {
    const response = await fetch(`${BASE_URL}/amis`, {
        method: "GET",
        headers: getHeaders(true)
    });
    return response.json();
}

export async function supprimerAmi(ami_id) {
    const response = await fetch(`${BASE_URL}/amis/${ami_id}`, {
        method: "DELETE",
        headers: getHeaders(true)
    });
    return response.json();
}

export async function bloquerAmi(ami_id) {
    const response = await fetch(`${BASE_URL}/amis/${ami_id}/bloquer`, {
        method: "PUT",
        headers: getHeaders(true)
    });
    return response.json();
}