//tenho a tela do carrinho com um botão de pagamento, crie a função de quando clicar em pagamento direciona para tela pagamento.js 
// front e back me passe como deve ficar











// quero pegar as informações do usuario 
// // Rota para obter dados do perfil do usuário autenticado
router.get('/', auth, (req, res) => {
    const userId = req.user.id;
  
    const query = 'SELECT id, name, email, phone, address FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Erro ao buscar perfil:', err);
        return res.status(500).json({ message: 'Erro ao buscar informações do perfil.' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      res.json(results[0]);
    });
  });

  //quero que pegue as informações do carrinho
  // Obter itens do carrinho
router.get('/', auth, async (req, res) => {
    try {
      const userId = req.user.id;
  
      const [cartItems] = await db.promise().query(
        `SELECT c.*, p.name, p.price, p.image 
         FROM cart c 
         JOIN products p ON c.product_id = p.id 
         WHERE c.user_id = ?`,
        [userId]
      );
  
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar itens do carrinho' });
    }
  });


  //quero que essas informações sejam passadas para o gerenciar pedidos através de um botão que tem na tela no 