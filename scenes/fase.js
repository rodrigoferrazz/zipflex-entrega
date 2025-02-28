class fase extends Phaser.Scene {

    constructor() {
        super({
            key: 'fase', // Identificador da cena
            backgroundColor: '#000', // Cor de fundo da cena
        });
    }

    preload() {
        // Carregando os assets do jogo
        this.load.atlas('entregador', 'assets/personagem/personagem.png', 'assets/personagem/personagem.json');
        this.load.image('fase', 'assets/terreno/Terrain (16x16).png');
        this.load.image('background', 'assets/terreno/Blue.png');
        this.load.tilemapTiledJSON('map', 'assets/terreno/terreno.json');
        this.load.image('colchao', 'assets/objetos/colchao.png');
        this.load.image('casa', 'assets/objetos/casa.png')
    }

    create() {
        var pontuacao = 0; 
        var placar;
        var colchaoLista = []; // Lista para armazenar os colchões coletáveis (apenas para exercitar, já que efetivamente só tem um colchão na tela)

        // Mensagem inicial usando swal
        Swal.fire({
            title: 'Novo Pedido!',
            text: 'O cliente acabou de comprar um colchão Zipflex! Corra para entregar!',
            icon: 'warning',
            confirmButtonText: 'Vamos lá!',
            backdrop: true,
            timer: 5000,
            timerProgressBar: true
        });

        // Define os limites do mundo do jogo
        this.matter.world.setBounds(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        // Criando o mapa do jogo
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('ultima', 'fase');
        const bg = map.addTilesetImage('bg', 'background');

        // Adicionando o fundo e o chão
        map.createLayer('bg', bg);
        const chao = map.createLayer('plataformas', tileset);
        chao.setCollisionByProperty({ colisao: true });
        this.matter.world.convertTilemapLayer(chao);

        // Adicionando a casa
        this.add.image(906, 126, 'casa').setScale(0.4);

        // Criando o personagem entregador
        this.entregador = this.matter.add.sprite(100, 610, 'entregador').setScale(1.3).setFixedRotation();
        this.entregador.play('parado', true);

        // Configurando controles
        this.cursors = this.input.keyboard.createCursorKeys();

        // Criando animações do entregador
        this.spritesheetEntregador = () => {
            this.anims.create({
                key: 'parado',
                frames: [{ key: 'entregador', frame: 'corre1.png' }]
            });
            this.anims.create({
                key: 'andando',
                frameRate: 5,
                frames: this.anims.generateFrameNames('entregador', { start: 1, end: 2, prefix: 'corre', suffix: '.png' }),
                repeat: -1
            });
            this.anims.create({
                key: 'pulo',
                frameRate: 10,
                frames: this.anims.generateFrameNames('entregador', { start: 1, end: 2, prefix: 'pula', suffix: '.png' }),
                repeat: -1
            });
        };

        this.spritesheetEntregador();

        // Criando múltiplos colchões usando um loop `for`
        const objectsLayer1 = map.getObjectLayer('colchao');
        for (let i = 0; i < objectsLayer1.objects.length; i++) {
            let objData = objectsLayer1.objects[i];
            let { x = 0, y = 0, name } = objData;

            if (name === 'colchao') {
                let colchao = this.matter.add.sprite(x, y, 'colchao', undefined, {
                    isStatic: true,
                    isSensor: true
                }).setScale(0.5);

                colchaoLista.push(colchao); // Adiciona à lista
            }
        }

        // Criando placar
        placar = this.add.text(50, 50, 'Colchões coletados: ' + pontuacao, { fontSize: '24px', fill: '#000' });

        // Verifica colisão entre entregador e colchão
        this.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;

                // Percorre a lista de colchões para ver se algum foi coletado
                for (let i = 0; i < colchaoLista.length; i++) {
                    if ((bodyA.gameObject === this.entregador && bodyB.gameObject === colchaoLista[i]) ||
                        (bodyB.gameObject === this.entregador && bodyA.gameObject === colchaoLista[i])) {
                        
                        pontuacao++;
                        placar.setText('Colchões coletados: ' + pontuacao);

                        // Exibe mensagem na tela
                        this.add.text(70, 400, "Agora entregue o colchão na casa do cliente!", { fontFamily: "Arial", fontSize: 24, color: "#000" });

                        colchaoLista[i].destroy(); // Remove o colchão coletado
                        colchaoLista.splice(i, 1); // Remove da lista
                        // Adiciona efeito especial quando o personagem coleta colchão
                        this.tweens.add({
                            targets: this.entregador,
                            alpha: 0,
                            duration: 100,
                            yoyo: true,
                            repeat: 5
                        });
                        
                        break; // Sai do loop para evitar verificar o mesmo colchão novamente
                    }
                }
            });
        });
    }

    update() {
        // Define a velocidade do entregador
        const velocidadeMovimento = 3;

        // Movimentação
        if (this.cursors.left.isDown) {
            this.entregador.setVelocityX(-velocidadeMovimento);
            this.entregador.play("andando", true);
            this.entregador.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.entregador.setVelocityX(velocidadeMovimento);
            this.entregador.play("andando", true);
            this.entregador.flipX = false;
        } else {
            this.entregador.setVelocityX(0);
            this.entregador.play("parado", true);
        }

        // Pulando
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && Math.abs(this.entregador.body.velocity.y) < 0.1) {
            this.entregador.setVelocityY(-8);
        }

        if (this.entregador.body.velocity.y !== 0) {
            this.entregador.play("pulo", true);
        }

        // Define um valor de tolerância para detectar a posição final
        const tolerancia = 20;
        // Se o colchão foi coletado, mudar de cena ao chegar na casa
        if (!this.colchao && !this.entregue) {
            if (Math.abs(this.entregador.x - 910) < tolerancia || Math.abs(this.entregador.x - 885) < tolerancia) {
                this.entregue = true; // ✅ Para evitar múltiplos alerts

                Swal.fire({
                    title: 'Colchão entregue!',
                    text: 'Que bom que conseguiu entregar ao cliente! O transporte desse colchão embalado a vácuo realmente não deve apresentar grandes dificuldades. Obrigado por jogar.',
                    icon: 'success',
                    confirmButtonText: 'Voltar para o começo',
                    preConfirm: () => {
                        this.scene.start('briefing');
                    },
                    backdrop: true,
                    timer: 15000,
                    timerProgressBar: true,
                    willClose: () => {
                        this.scene.start('briefing');
                    }
                });
            }
        }   
    }
}
