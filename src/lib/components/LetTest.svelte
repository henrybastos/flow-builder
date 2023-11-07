<script>
    export let id;

    function sayId () {
        console.log(`My id is: ${ id }`);
    }
</script>

<slot {id} {sayId} />