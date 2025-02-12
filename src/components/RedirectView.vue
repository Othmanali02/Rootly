<script setup>
import axios from 'axios';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
onMounted(async () => {
    console.log("this is being mounted");
    let queryString = Object.keys(route.query)
        .map(key => `${key}=${encodeURIComponent(route.query[key])}`)
        .join('&');

    const finalUrl = "http://localhost:3000/redirect?" + queryString;

    try {
        const response = await axios.get(finalUrl);
        console.log(response);
        if (response.status === 200) {
            console.log('Redirecting...');

            let username = response.data.preferred_username;
            let email = response.data.email;
            let name = response.data.name;
            let token = response.data;

            console.log(token);

            localStorage.setItem('auth_token', JSON.stringify(token));
            localStorage.setItem('auth_user', JSON.stringify({
                username: username,
                email: email,
                name: name,
            }));



            // window.location.href = 'http://localhost:8080';
        }
    } catch (error) {
        console.error('Error in request:', error);
    }
});
</script>

<template>
    <div class="min-h-screen">
        redirecting...
    </div>
</template>
