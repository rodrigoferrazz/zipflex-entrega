class briefing extends Phaser.Scene {
    constructor() {
        super({ key: 'briefing', backgroundColor: '#000' }); // Define a chave e cor de fundo da cena
    }

    /* Pré-carrega os recursos da cena, como imagens do site e do cursor.*/
    preload() {
        this.load.image('site1', 'assets/1.png');   // Tela inicial do site
        this.load.image('cursor', 'assets/cursor.png'); // Cursor padrão
        this.load.image('click', 'assets/click.png');   // Cursor clicando
    }

    create() {
        
        // Adiciona a imagem do site como plano de fundo
        this.add.image(480, 360, 'site1');
        
        // Adiciona o cursor na posição inicial
        this.cursor = this.add.image(480, 300, 'cursor').setScale(1.2);

        // Cria uma animação do cursor se movendo para simular um clique
        this.tweens.add({
            targets: this.cursor,
            x: 200,  // Posição final do cursor no eixo X
            y: 95,  // Posição final do cursor no eixo Y
            duration: 3800, // Duração da animação
            ease: 'Power2', // Suaviza o movimento
            onComplete: () => {
                this.cursor.setTexture('click').setScale(0.07); // Muda a imagem do cursor para a versão "clicando"
                // Após um pequeno atraso, muda para a próxima cena
                this.scene.start('briefing2');
            }
        });
    }
    if(game.scale.orientation == Phaser.Scale.LANDSCAPE){
            console.log("deitado")
        } else if (game.scale.orientation == Phaser.Scale.PORTRAIT) {
            alert("Deite seu celular!")
        }
}
