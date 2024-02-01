<script>
    import DraggableList from "$lib/components/DraggableList.svelte";
    import Button from "$lib/components/ui/button/button.svelte";

    let users = [
        {
            name: 'Henry',
            games: [
                'Rocket League',
                'GTA V',
                'Valheim'
            ]
        },
        {
            name: 'Heitor',
            games: [
                'Valorant',
                'Palworld',
                'Palia',
            ]
        }
    ]
</script>

<main class="flex flex-col gap-y-3">
    <DraggableList itemsList={users} let:item={user}> 
        <div draggable_id={user.name} class="border-neutral-700 border-2 rounded-lg p-4">
            <h2 class="text-3xl">{ user.name }</h2>
            <div>
                <h3 class="text-xl mb-6 text-left">Games</h3>
                <DraggableList itemsList={user.games} let:item={game} class="flex flex-col transition-all">
                    <span draggable_id={`${user.name}_${game}`} class="flex border-neutral-700 border-2 rounded-lg p-2 mt-2">{ game }</span>
                </DraggableList>
            </div>
        </div>
    </DraggableList>
    
    <Button on:click={() => console.log('USERS', JSON.stringify(users, null, 3))}>Print users</Button>
</main>