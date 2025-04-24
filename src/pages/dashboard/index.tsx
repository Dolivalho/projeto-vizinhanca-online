import { useContext, useEffect, useState } from "react"
import { Container } from "../../components/container"
import { DashboardHeader } from "../../components/panelheader"

import { collection, getDocs, where, query, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import { ref, deleteObject } from "firebase/storage";

//Link de imagem estática para exemplo
import image1 from '../../assets/images/torta.jpg';

import { FiTrash2 } from "react-icons/fi"


interface ItemProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  validity: string;
  images: ImageItemProps[];
}

interface ImageItemProps {
  name: string;
  uid: string;
  url: string;
}


export function Dashboard() {

  const [items, setItems] = useState<ItemProps[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    function loadItems() {

      //No if ele verifica se existe algum user logado, caso o uid do usuário não retorne, o return é chamado para parar a função (para de buscar os produtos).
      if (user?.uid) {
        return;
      }


      const itemsRef = collection(db, "products"); //"products" seria o nome da nossa coleção no nosso banco de dados, onde vamos salvar os produtos cadastrados pelo user logado. Criado lá no nosso index.tsx do new
      const queryRef = query(itemsRef, where("uid", "==", user?.uid));//Aqui vamos pegar apenas os itens que dentro do nosso item tem a propriedade uid que é igual ao uid do user logado. Aparecerá apenas os produtos cadastrados pelo user logado.


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
    loadItems();
  }, [user])


  async function handleDeleteItem(item: ItemProps) { //Aqui estamos pegando o item que queremos deletar, e esse item recebe as propriedades do type ItemProps.
    const itemProduct = item; //Dentro dessa variável vamos ter o carro que clicamos para deletar.

    const docRef = doc(db, "products", itemProduct.id); //Aqui estamos pegando o documento do produto que queremos deletar. O db faz a conexão com o banco de dados, o "products" seria o nome da coleção onde estamos salvando os produtos cadastrados pelo user logado, e o id seria o id do produto que queremos deletar.
    await deleteDoc(docRef); //Aqui passamos o nosso docRef que é aonde ele vai deletar.
    
    //Passamos o map abaixo para percorrer o nosso array de imagens, pois pode haver mais de uma img em um produto.
    itemProduct.images.map( async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`; //Aqui estamos passando o caminho da onde essas imagens estão no nosso storage, passando uid que é o id da imagem, e o name que é o nome da imagem.
      const imageRef = ref(storage, imagePath); //Já aqui, vamos criar uma referência para a imagem que vamos deletar.
    
      await deleteObject(imageRef) //Aqui vamos deletar a imagem do nosso storage.

      //Como ela é uma função assíncrona utilizamos o try catch apenas para tratar caso ocorra um erro.
      try {
        await deleteObject(imageRef) //Aqui vamos deletar a imagem do nosso storage.
        setItems(items.filter(item => item.id !== itemProduct.id)); //Aqui ele vai filtrar os itens, onde o car.id for diferente do itemProduct.id (que é o carro que clicamos para deletar). Assim não gera confusão no código na hora de re-renderizar os itens não clicamos para deletar.

      }catch(err) {
        console.log('Erro ao deletar a imagem', err);
      }

    })
  }


  return (
    <Container>
      <DashboardHeader />

      {/*Inicio da section dinâmica */}
      {/*Abaixo temos uma section dinâmica onde vamos exibir nossos produtos cadastrados no banco de dados. */}
      {/* <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

        {items.map(item => (
          <section key={item.id} className="w-full bg-white rounded-lg relative">

            <button
              onClick={() => handleDeleteItem(item)}
              className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow cursor-pointer"
            >
              <FiTrash2 size={26} color="#000" />
            </button>

            <img
              className="w-full rounded-lg mb-2 max-h-70"
              src={item.images[0].url}
              alt="Imagem de um produto"
            />
            <p className="font-bold mt-1 px-2 mb-2">{item.name}</p>

            <div className="flex flex-col px-2">
              <span className="text-zinc-700">
                {item.year} | {item.validity}
              </span>
              <strong className="text-black font-bold mt-4">
                R$ {item.price}
              </strong>
            </div>

            <div className="w-full h-px bg-slate-200 my-2"></div>
            <div className="px-2 pb-2">
              <span className="text-black">
                {item.city}
              </span>
            </div>

          </section>
        ))}

      </main> */}
      {/*Fim da section dinâmica*/}



      {/*Inicio da section estática*/}
      {/*Abaixo temos uma section estática para demonstrar o funcionamento do site sem precisar de um banco de dados, é recomendado que utilize o exemplo acima que já possui uma conexão com o BD */}
      <main
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <section className="w-full bg-white rounded-lg relative">

          <button
            onClick={() => { }}
            className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow cursor-pointer"
          >
            <FiTrash2 size={26} color="#000" />
          </button>

          <img
            className="w-full rounded-lg mb-2 max-h-70"
            src={image1}
            alt="Imagem de um produto"
          />
          <p className="font-bold mt-1 px-2 mb-2">Torta de Frango</p>

          <div className="flex flex-col px-2">
            <span className="text-zinc-700">
              Feita em 13/04/2025 | Recheio de frango, milho, requeijão
            </span>
            <strong className="text-black font-bold mt-4">
              R$ 8,00
            </strong>
          </div>

          <div className="w-full h-px bg-slate-200 my-2"></div>
          <div className="px-2 pb-2">
            <span className="text-black">
              Borda da Mata - Rua Sebastião Ferreira Diniz, 49
            </span>
          </div>
        </section>
      </main>
      {/*Fim da section estática */}

    </Container>
  )
}