<div align="center">
    <img width="128px" src="https://images.discordapp.net/avatars/539853186572222464/013ab8a9d61a878eb8a20d12ead27ace.png"><br>
</div>

# Tobias De Chápeu - Um Simples Bot Para Discord
Um simples bot para Discord com base em javascript muito legal quer dar uma olhada nele? 
Aposto que vai se surpreender com as funções dele aproveita e entra la no meu servidor pra me dar uma força la

# Como Instalar:
#### Nota:
Caso você utilize a versão estável do **discord.js**, adquirida diretamente pelo **`npm i discord.js`**, você deverá instalar em sua máquina a versão **estável** - [Clicando Aqui](https://github.com/discordjs/discord.js).
### Primeiro Passo:
Clone o repositório em sua máquina: `git clone https://github.com/tobias-inc/Tobias_Pc`
### Segundo Passo:
Feito o passo anterior, você precisa instalar as dependências do projeto.  
Em seu terminal, digite `npm install`.
### Terceiro Passo:
##### Você precisará de **Sete** Keys para que o progeto funcione
Chaves | Onde Adquirir
------------ | -------------
Youtube Data v3 | [Clique Aqui](https://console.cloud.google.com/marketplace/details/google/youtube.googleapis.com)
Spotify | [Clique Aqui](https://developer.spotify.com/dashboard/applications)
Genius | [Clique Aqui](https://docs.genius.com/#/getting-started-h1)
Discord Bot List | [Clique Aqui](https://discordbots.org/api/docs)
Bots Para Discord | [Clique Aqui](https://docs.botsparadiscord.xyz/#introducao)
Mongo DB | [Clique Aqui](https://www.mongodb.com)
Pastebin | [Clique Aqui](https://pastebin.com/api.php)

### Quarto e último Passo:
#### Bom, se você fez os passos anteriores corretamente, vamos prosseguir!
Creio que já tenha pego o **token** de seu bot. Não pegou ? Não tem problema... [clique aqui](https://discordapp.com/developers/applications/) pegue seu token e volte, eu estarei te esperando.  

Agora só ligar seu bot! em sua linha de comando digite `node .`

**Verifique se você colocou as variáveis corretamente em seu `.env`, não se apresse, dê uma última olhada no [exemplo](https://github.com/tobias-inc/Tobias_Pc/blob/master/.env.example) disponibilizado por mim mesmo.**
#### Pronto seu bot ficará **Online**!
## Setando os 'Managers':
### Se você chegou nesse tópico, é porque seu bot já está online. Porém deseja ter acesso ao **eval** e não sabe como....
#### Primeiramente você terá que vizualizar a sua `MongoDB Compass`.
* Na aba `users` procure o item com o seu ID
* Se você localizou, o item terá um campo em **Booblean** com o nome contributor.
* Siga o passo abaixo.

##### No arquivo terá:
```javascript
contributor:
redirect:"None"
owner:false
develope:false
translater:false
designer:false
```

#### Agora mude owner:false para true no local especificado acima!
Obs: Você apos fazer isso pode usar o comando set para definir os cargos dos users via bot

# Não conseguiu obter sucesso ?
#### Me chame no discord. Lá estarei te ajudando e tirando suas dúvidas 😃 - @Async#2889 
### Antes de me mandar uma DM, por favor, tente refazer os passos.
