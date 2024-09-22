document.querySelector('.busca').addEventListener('submit', async (event) => {
//Não podemos deixar o formulário ser enviado, do contrário a página atuliza e perdemos tudo que estamos fazendo, visto que vamos usar oq o usuário digitou.
    event.preventDefault();//Função nativa do JS que previne q o padrão de algo seja realizado, como por exemplo o submit do form.
    let input = document.querySelector('#searchInput').value;//pegando oq o usuário digitou
    console.log(input);

    if(input !== '') {//caso tenha algo digitado
        clearInfo();
        showWarning('Carregando...');
//URL do site da API com o ENCODE para evitar erros
//O símbolo & é usado em URLs para separar múltiplos parâmetros de uma query string em uma requisição HTTP.
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(input)}&units=metric&lang=pt_br&appid=42df8471ccc17dcf241b14f890b0a807`; //encodeURI() para evitar o problema de caracteres especiais como os espaços, etc, ele transforma o texto mas mantem esses espaços simbolizados por algum caractere especial como a %.
//APPID = APIKEY é a chave para que a API controle os acessos e pegue informações necessárias para ela, é gerada dentro do próprio site após logarmos na nossa conta nesse caso.
//&units=metric é um parametro opcional, o padrão/standard no site vem em fahrenheit, para pegar em Celsius basta colocar units=metric. METRIC é oq usamos.
//&lang=pt_br é um parametro opcional, o padrão é em ingles, estamos pegando em Portugues o retorno.
//abaixo a requisição, Usando função async await para aguardar o resultado de cada uma.
        let results = await fetch(url);
        let json = await results.json();
        console.log(json);
//verificando se a requisição deu certo 200 ou errada 404, tudo isso da pra ver na parte Network do inspecionar, assim como todos os dados do objeto retornado que vamos utilizar, como o cod abaixo.
        if(json.cod === 200) {
            showInfo({
                //passando as informações que vamos usar do objeto após feita a requisição, para isso precisamos analizar o objeto e ver onde esta cada informação e passar pra ca.
                name: json.name,
                country: json.sys.country,
                temp: json.main.temp,
                tempIcon: json.weather[0].icon,//Está dentro de um objeto, que esta dentro de um array e o array dentro de outro objeto
                windSpeed: json.wind.speed,
                windAngle: json.wind.deg
//Com isso pegamos todas as informações que queremos da requisição
            })
        } else {
            clearInfo(); //para que ao pesquisar o nome de uma localização que não existe, o resultado da anterior também seja limpo.
            showWarning('Não encontramos essa localização');
        }
    } else {
        clearInfo();
    }


});
//função que irá concatenar os dados o objeto json que queremos usar e mostrar na tela.
function showInfo(json){
    showWarning('');//retirando a msg de aviso "Carregando..."
//Ao usar innerHTML para adicionar conteúdo a um elemento HTML, o novo conteúdo substitui tudo o que estava originalmente dentro do elemento.
    document.querySelector('.titulo').innerHTML = `${json.name}, ${json.country}`;
    document.querySelector('.tempInfo').innerHTML = `${json.temp} <sup>°C</sup>`;//usamos novamente a tag SUP pois ela iria ser apagada visto que estamos usando o innerHTML para inserir esses dados
    document.querySelector('.ventoInfo').innerHTML = `${json.windSpeed} <span>km/h</span>`;//mesmo caso do span, temos que readicionar a tag HTML que estava dentro.
    document.querySelector('.resultado').style.display = 'block';//retirando o display:none no CSS para quando aparecer o resultado ele ser mostrado. Deixamos ele no final para primeiro carregar todas as informações anteriores e após isso sim mostrar ele na tela por conta de clean code.

//O icone vem em um URL no objeto, por isso que usamos o SETATTRIBUTE pois ele pega o atributo SRC que é a source da imagem no HTML e mudamos apenas a parte que faz com o ícone seja diferente
    document.querySelector('.temp img').setAttribute('src', `http://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);
    document.querySelector('.ventoPonto').style.transform = `rotate(${json.windAngle-90}deg)`;//estamos mudando a propriedade CSS inline rotate:deg do css para que rotacione a imagem de acordo com o grau que o vento está para cada pesquisa, essa imagem foi criada no CSS com o rotate(0deg) e o transform-orign left, apenas estamos mudando os DEG de acordo com cada objeto.
//o -90 é devido a posição 0 DEG ser bem no meio.
}

//Caso não encontre o resultado da requisição ele remove o warning assim como o resultado a pesquisa anterior na tela para n confundir
function clearInfo() {
    showWarning('');
    document.querySelector('.resultado').style.display = 'none';
}

//importante para avisar o usuário que a requisição esta sendo feita mesmo ele não vendo o resultado ainda, visto q é uma requisição interna.
function showWarning(msg) {
    document.querySelector('.aviso').innerHTML = msg;
}
