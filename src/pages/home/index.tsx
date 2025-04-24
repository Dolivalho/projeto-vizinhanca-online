//Link de imagem estática para exemplo
import image1 from '../../assets/images/torta.jpg';

import { useState, useEffect } from 'react';
import { Container } from "../../components/container";
import { Link } from 'react-router-dom';

import {
  collection,
  query,
  getDocs,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';


//Tipagem para nossos itens
interface ItemProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  validity: string | number;
  images: ItemImageProps[];
}

//Tipagem para nossas imagens
interface ItemImageProps {
  name: string;
  uid: string;
  url: string;
}



export function Home() {
  const [items, setItems] = useState<ItemProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);//Quando estiver vazio quer dizer que não há nenhuma imagem, e quando carregar ele chama a function handleImageLoad.
  const [input, setInput] = useState("");


  useEffect(() => {
    loadItems();
  }, [])

  function loadItems() {
    const itemsRef = collection(db, "products"); //"products" seria o nome da nossa coleção no nosso banco de dados, onde vamos salvar os produtos cadastrados pelo user logado. Criado lá no nosso index.tsx do new
    const queryRef = query(itemsRef, orderBy("created", "desc")); //Aqui vamos criar uma query, onde vamos ordenar os produtos cadastrados pela data de quando eles foram cadastrados, do mais recente para o mais antigo.

    //O getDocs vai buscar todos os documentos que ele encontrar no nosso db, e então recebemos esse valores no nosso snapshot, e como ele é uma lista temos acesso a cada documento e a cada propriedade dentro dessa variável doc.
    getDocs(queryRef)
      .then((snapshot) => { //snapshot seria o nosso array de produtos cadastrados, ou seja, os produtos cadastrados pelo user logado.

        // eslint-disable-next-line prefer-const 
        let listItems = [] as ItemProps[]; //Inicialmente estáa sendo utilizado o let, porém de acordo com a doc do ESLint, é recomendado o uso de const. https://eslint.org/docs/latest/rules/prefer-const

        snapshot.forEach(doc => {
          listItems.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            uid: doc.data().uid,
            price: doc.data().price,
            city: doc.data().city,
            validity: doc.data().validity,
            images: doc.data().images
          })
        })

        setItems(listItems);
      })
  }



  //A function handleImageLoad vai ser chamada quando a imagem for carregada, ou seja, quando o onLoad do img for chamado, enquanto ela não estiver carregada seu placeholder vai estar reservado. Assim criamos uma renderização condicional, onde caso a imagem ainda nao tenha sido carregada, ela vai mostrar o placeholder, e caso ela tenha sido carregada, ela vai mostrar a imagem.
  /*
  function handleImageLoad(id: string) { //aqui passamos o id como parametro, para saber qual imagem foi carregada.
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]); //Quando a imagem for carregada ele chamará essa função recebendo o id e então passamos para nosso useState que caso ja tenha alguma imagem carregada ele vai adicionar o id dessa imagem ao nosso array de imagens carregadas.
  }
  */

  async function handleSearchItem() {
    if(input === '') {
      loadItems();
      return;
    }

    setItems([]);
    setLoadImages([]);

    const q = query(
      collection(db, "products"),
      where("name", ">=", input.toUpperCase()),
      where("name", "<=", input.toUpperCase() + '\uf8ff')// O '\uf8ff' é um caractere Unicode que representa o fim da palavra( ele é utilizado para marcar o final de consultas de algum prrefixo), ele é usado para garantir que a consulta vai incluir todos os caracteres na string de busca.
    )

    const querySnapshot = await getDocs(q);

    const listItems = [] as ItemProps[];

    querySnapshot.forEach((doc) => {  
      listItems.push({
        id: doc.id,
        name: doc.data().name,
        year: doc.data().year,
        uid: doc.data().uid,
        price: doc.data().price,
        city: doc.data().city,
        validity: doc.data().validity,
        images: doc.data().images
      })
    })

    setItems(listItems);
  }





  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          placeholder="Digite o nome do item que deseja buscar..."
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-orange-500 h-9 px-8 rounded-lg text-white font-medium cursor-pointer"
          onClick={handleSearchItem}
        >
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Itens novos e usados pertinho de você!
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/*Inicio da section dinâmica */}

        {/*Abaixo temos uma section dinâmica onde vamos exibir nossos produtos cadastrados no banco de dados. */}
        {/* 
        {items.map(item => (
          <Link key={item.id} to={`/item/${item.id}`}>
            <section className="w-full bg-white rounded-lg">
              
              <div //Aqui temos uma renderização condicional, se a imagem existir tiramos o cinza da tela ("none") e mostramos a imagem, senão mostramos o cinza ("block"). (linha 111 a 114)
                className='w-full h-72 rounded-lg bg-slate-200'
                style={{ display: loadImages.includes(item.id) ? "none" :  "block" }}
              ></div>
              
              <img
                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                src={item.images[0].url}
                alt="Item"
                onLoad={() => handleImageLoad(item.id)}
                style={{ display: loadImages.includes(item.id) ? "block" :  "none" }} //Aqui temos uma renderização condicional, onde caso a imagem ainda nao tenha sido carregada, ela vai mostrar o placeholder, e caso ela tenha sido carregada, ela vai mostrar a imagem.
              />
              <p className="font-bold mt-1 mb-2 px-2">{item.name}</p>

              <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6">Feita em 13/04/2025 | {item.validity}</span>
                <strong className="text-blac font-medium text-xl">R$ {item.price}</strong>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-2 pb-2">
                <span className="text-zinc-700">
                  {item.city}
                </span>
              </div>
            </section>
          </Link>
        ))}
        */}
        {/*Fim da section dinâmica*/}


        {/*Inicio da section estática*/}
        {/*Abaixo temos uma section estática para demonstrar o funcionamento do site sem precisar de um banco de dados, é recomendado que utilize o exemplo acima que já possui uma conexão com o BD */}
        <Link to="/item/1">
          <section className="w-full bg-white rounded-lg">
            <img
              className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
              src={image1}
              alt="Item"
            />
            <p className="font-bold mt-1 mb-2 px-2">Torta de frango caseira</p>

            <div className="flex flex-col px-2">
              <span className="text-zinc-700 mb-6">Feita em 13/04/2025 | Recheio de frango, milho, requeijão</span>
              <strong className="text-blac font-medium text-xl">R$ 8,00</strong>
            </div>

            <div className="w-full h-px bg-slate-200 my-2"></div>

            <div className="px-2 pb-2">
              <span className="text-zinc-700">
                Borda da Mata - Rua Sebastião Ferreira Diniz, 49
              </span>
            </div>
          </section>
        </Link>
        {/*Fim da section estática */}

      </main>
    </Container>
  )
}
