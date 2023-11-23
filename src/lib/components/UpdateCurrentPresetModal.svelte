<script>
    import Modal from "./Modal.svelte";
    import { FLOW_PRESETS, CURRENT_PRESET_NAME } from "$lib/PresetsStore";
    import { PAYLOAD } from "$lib/PayloadStore";

    let openDangerModalFunction;

    function updatePreset () {
        FLOW_PRESETS.savePreset({ [$CURRENT_PRESET_NAME]: { ...$PAYLOAD } });
        console.log('Preset updated!');
    }
</script>

<button class="btn-md" on:click={() => openDangerModalFunction(updatePreset, { danger_modal_title: `Update current preset (${ $CURRENT_PRESET_NAME }) ?`, danger_confirm: 'Update' })}>
    <i class="ti ti-arrows-transfer-up text-blue-500"></i>
    Update preset: 
    <span class="text-blue-500">{ $CURRENT_PRESET_NAME }</span>
</button>

<Modal bind:openDangerModal={openDangerModalFunction} />


<!-- 

                                                  ,....,.
                                          ..''   .'
                                       .'"       |
                                    .''          \
                                 .''              \.
                               .'                  .".,
                             ,:'             ..,'"'   '...,..::/"".....
                           /'"          .,'"'  .,',:,'""'         .,''
                         ,'.'      .,'"' ..,''' ""         .'   ."'
                       ,'  \, ..,''  .,''. ..,'""        ./   ."
                     ."     .,"  .,'".,"'./           ..''   /
                    ,'    .'  ./'.,"'  .'  "'     ." '.     /
                  .'   ./' ./"."\,..,''     '" ../,     ,  |
                 ,   ./' .'./'|/     ............        ',|
                /   /' ,'.".,'""\..... '""""""""'  .::/'.., |
               /  ." ,' ':\ """  |  ,      ''          '""   \
              /  /'.''. |:::::::""' ,' ' ''. ".,.,  """'    .""
             | ." /.,":. ""..,   "\'.."'..  ;"'  '\.'"""  ."
             | \.:\.    '""./\ \  | ' '" .,"".           /
             / \'   '"..     ", \  \,',     "'..  .,     '
            /.'",''..,  '\,   '\ ". '\'.,     , "'. "'.,|
           .,'        '". ',    \ '.".. ''../'      "" __\
           '             \,',    \  '.'\..,  ","'  .'"
                         |  |    '| ,\""'\/.  |  ."
            ."          .|  .    / / ./'. '.".' /'
            /'        ..|':"""\././  /   "  '/\.'
           //  ./  .'"    /' ./'.' .'  | ..,  ':|
         ./:  ,/   |",   ' ."'  :  '   |    .../:,
        .'.'.\/   /.'           ''  .,   ..\'
      .,\.\".'   /"    ,"' \...,      "\.\| ",
     /    ./""""'   ..:    ',|  "".,     '\  ',
  .,' "'   \|     "".'".    '/  .| '\.     ", '\
 /          \.    ../,   "./ '\ |'  \/"" '".'\  \
/   '\\:.   \,"\::'  ./""'    ./|  .'     .'"/| '|
' ,"\:"/"""  /'  ."\'  .., |:| .| |'    .'' .\|  ',
|/  / /'    .'| /  |. \,    /'"/. |  |:\..," .||  \
'' /.'      //\|'  '\/\:.   :,/"'::.  ,   ..::'|  |
            ||'/,    '\\/"\ '/|    '\ '"::::"| || .
            || \\       "".   ...,  '.  \\...| |' |
            ||  "\,         .".\, ". ', | \  '||  |
             '              |\|'|\/.''\ | |\  ||  |
                            ||\/"/| '\, ., / / /  ,
                             ' \  "   '"  / / .' /
                                '      .'".' .' /
       -hrr-                      ..'"'.." ." ."
                              .,"":.'""..'" ."
                         .,:'"'"'  .'"  ..'"
                       ." ."'..'""...,"'
                    .." "    , ""'
                   /  . :/"'
                 .'  :/'
                /  /'
               / .'
              / '
             /.'
             '

------------------------------------------------
Thank you for visiting https://asciiart.website/
This ASCII pic can be found at
https://asciiart.website/index.php?art=creatures/dragons
-->