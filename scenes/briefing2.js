class briefing2 extends Phaser.Scene {

    constructor() {
        super({
            key: 'briefing2', // Chave da cena para referência no jogo
            backgroundColor: '#000', // Define a cor de fundo
        });
    }

    preload() {
        // Carregamento dos assets necessários para a cutscene
        this.load.image('cursor', '../assets/cursor.png');
        this.load.image('click', '../assets/click.png');
        this.load.image('site2', '../assets/2.png');
    }

    create() {
        // Adiciona a imagem do site no centro da tela
        this.add.image(480, 360, 'site2');
        
        // Adiciona o cursor na posição inicial
        this.cursor = this.add.image(200, 120, 'cursor').setScale(1.2);
        
        // Animação do cursor simulando um movimento até o botão de compra
        this.tweens.add({
            targets: this.cursor,
            x: 800, // Posição final X do cursor
            y: 450, // Posição final Y do cursor
            duration: 3800, // Tempo da animação
            ease: 'Power2', // Suavização do movimento
            onComplete: () => {
                // Quando o cursor chega ao destino, muda a textura para representar o clique
                this.cursor.setTexture('click').setScale(0.07);
                
                // Após o clique, inicia a próxima cena do jogo
                this.scene.start('fase');
            }
        });
    }

    update() {}
}