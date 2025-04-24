import { ChangeEvent, useState, useContext } from "react"
import { Container } from "../../../components/container"
import { DashboardHeader } from "../../../components/panelheader"

import { FiTrash, FiUpload } from "react-icons/fi"
import { useForm } from "react-hook-form"
import { Input } from "../../../components/input"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthContext } from "../../../contexts/AuthContext"

//A biblioteca uuid é responsável por gerar um id unico/aleatorio para cada que imagem que o usuário cadastrar. Para não ocasionar o erro de duas imagens serem enviadas com o mesmo nome, e uma substituir a outra.
//Para baixar a biblioteca: npm install uuid e depois para instalar as tipagens do TS: npm install @types/uuid --save-dev para salvar como dependência de desenvolvimento.
import { v4 as uuidV4 } from "uuid"

import { storage, db } from "../../../services/firebaseConnection"// Importando o storage para armazenar as imagens, e o db para armazenar os dados do item.
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage"
import { addDoc, collection } from "firebase/firestore" //Importando o addDoc para cadastrar os dados no nosso db, e o collection para criar uma coleção para armazenar os dados.

import { toast } from "react-hot-toast"


const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  categorie: z.string().nonempty("O campo categoria é obrigatório"), //O campo categoria é o modelo do carro
  year: z.string().nonempty("O campo data é obrigatório"), //O campo data é o ano
  validity: z.string().nonempty("O campo validade é obrigatório"), //O campo validade é o km rodados
  price: z.string().nonempty("O campo preço é obrigatório"),
  city: z.string().nonempty("O campo cidade é obrigatório"),
  //Explicando o regex aplicado no exemplo do whatsapp: O regex serve para verificar se o telefone possui 11 digitos.
  whatsapp: z.string().min(1, "O telefone deve ter 11 digitos").refine((value) => /^(\d{11,12})$/.test(value), {
    message: "Número de telefone inválido",
  }),
  description: z.string().nonempty("O campo descrição é obrigatório")
})

//O formData vai ser um type de um objeto que vai ser criado com base no schema acima
type FormData = z.infer<typeof schema>;


//tipagem para o nosso array de imagens
interface ImageItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string
}

export function New() {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  //const para armazenar as imagens, para depois podermos exibi-las na tela (nosso array de imagens).
  const [images, setImages] = useState<ImageItemProps[]>([]);


  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        //Só será aceito se for uma imagem jpeg ou png. Se for aceito então a imagem será enviada ao banco de dados.
        await handleUpload(image);
      } else {
        toast.error("Envie uma imagem do tipo png ou jpeg");
        return;
      }
    }
  }


  async function handleUpload(image: File) {
    //Abaixo é feita a verificação para que caso não haja um user.uid não é nem feita a tentativa de upload de imagem, pois a imagem precisa ter um dono.
    if (!user?.uid) {
      return
    }

    const currentUid = user?.uid; //const para pegar o uid do user logado.
    const uidImage = uuidV4(); //const para gerar um id unico para cada imagem.

    //Aqui vai ser feita a tentativa de upload da imagem ao banco de dados.
    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`); //Nessa linha estamos definindo o caminho para onde a imagem vai ser salva no banco de dados. Onde criamos uma pasta images dentro do storage e dentro dessa pasta criamos uma pasta com o uid do user logado, e dentro dessa pasta criamos uma pasta com o id unico da imagem.

    //Abaixo passamos nosso uploadRef (referência), onde ele vai enviar para nossa referência, qual o id do usuário e qual o id da imagem, através do File que vamos receber esse arquivo. O uploadBytes é uma promisse, ou seja ele pode falhar como pode dar sucesso. Então através do .then vamos ver se ele deu certo ou falhou.
    uploadBytes(uploadRef, image)
      .then(async (snapshot) => {
        //Aqui vamos pegar a url da imagem e acessá-la depois que ela que foi enviada ao banco de dados.
        getDownloadURL(snapshot.ref).then((dowloadUrl) => {
          const imageItem = {
            name: uidImage,
            uid: currentUid,
            previewUrl: URL.createObjectURL(image), //Aqui vamos pegar a url da imagem sem que precise pegar a que foi enviada ao banco, para isso usamos URL.createObjectURL(image) que nada mais é do que criar um objeto URL com a url da imagem.
            url: dowloadUrl, //Aqui vamos pegar a url da imagem que foi enviada ao banco de dados.
          }

          setImages((images) => [...images, imageItem]); //Aqui vamos adicionar a imagem ao nosso array de imagens, caso já exista alguma imagem.
          //Basicamente o que fazemos acima na nossa const imageItem, é criar um objeto com as propriedades name, uid, previewUrl e url, e depois adicionar esse objeto ao nosso array de imagens, através do setImages(useState).
          toast.success("Imagem cadastrada com sucesso!");
        })
      })
  }


  //O onSubmit vai receber uma propriedade data que pode conter as propriedades do type FormData 
  function onSubmit(data: FormData) {
    
    if(images.length === 0) {
      toast.error("Envie pelo menos 1 imagem");
      return;
    }

    //const para remover o previewUrl e enviar somente as informações que vamos enviar ao banco de dados.
    const listImages = images.map( image => {
      return {
        url: image.url,
        name: image.name,
        uid: image.uid
      }
    })

    //Abaixo no nosso addDoc vamos enviar cadastrar os valores abaixo no nosso db
    //O addDoc é uma promisse, ou seja ele pode falhar ou dar sucesso. Então vamos usar o .then para ver se ele deu certo ou falhou.
    addDoc(collection(db, "products"), { //"products" seria o nome da nossa coleção no nosso banco de dados, onde vamos salvar os produtos cadastrados pelo user logado.
      name: data.name.toUpperCase(),
      categorie: data.categorie,
      year: data.year,
      validity: data.validity,
      price: data.price,
      city: data.city,
      whatsapp: data.whatsapp,
      description: data.description,
      created: new Date(), //Aqui vamos pegar a data atual de quando o item está sendo cadastrado
      owner: user?.name, //Aqui vamos pegar o name do user logado
      uid: user?.uid, //Aqui vamos pegar o uid do user logado
      images: listImages //Aqui vamos enviar as imagens ao banco de dados
    })
    .then(() => {
      reset(); //Aqui vamos limpar o formulario
      setImages([]); //Aqui vamos limpar o array de imagens
      console.log('Produto cadastrado com sucesso!');
      toast.success("Produto cadastrado com sucesso!");
    })
    .catch((error) => {
      console.log('Erro ao cadastrar o produto', error);
      toast.error("Erro ao cadastrar o produto!");
    })
  }


  //Tranformamos uma function em assíncrona pois vamos precisar esperar o upload da imagem ao banco de dados para poder deletar a imagem. E aí depois com o deleteObject vamos deletar a imagem do storage.
  async function handleDeleteImage(item: ImageItemProps) {
    const imagePath = `${item.uid}/${item.name}`; //aqui estamos passando o caminho da onde essa imagem está no nosso storage, segue a mesma regra quando vamos fazer o upload.

    const imageRef = ref(storage, imagePath); //Já aqui, vamos criar uma referência para a imagem que vamos deletar.

    try {
      await deleteObject(imageRef)
      setImages(images.filter((image) => image.url !== item.url)) //Aqui vamos deletar a imagem do nosso array de imagens, caso ela seja igual ao url da imagem que vamos deletar. Através do filter do JS e vamos devolver todos os itens, menos esse que o usuário clicou para excluir. 
    }catch(err) {
      console.log('Erro ao deletar', err);
    }
  }

  return (
    <Container>
      <DashboardHeader />

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="opacity-0 cursor-pointer"
              onChange={handleFile}
            />
          </div>
        </button>

        {images.map(item => (
          <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
            <button className="absolute cursor-pointer" onClick={() => handleDeleteImage(item)}>
              <FiTrash size={28} color="#FFF" />
            </button>
            <img
              src={item.previewUrl}
              className="rounded-lg w-full h-32 object-cover cursor-pointer"
              alt="Foto do Item"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}
        >

          {/* <div> do input Nome*/}
          <div className="mb-3">
            <p className="mb-2 font-medium">Nome do item</p>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Exemplo: Torta de frango..."
            />
          </div>

          {/* <div> do input */}
          <div className="mb-3">
            <p className="mb-2 font-medium">Categoria do item</p>
            <Input
              type="text"
              register={register}
              name="categorie"
              error={errors.categorie?.message}
              placeholder="Exemplo: Comida..."
            />
          </div>

          {/* Div que envolve os dois inputs um ao lado do outro*/}
          <div className="flex w-full mb-3 flex-row items-center gap-4">
            {/* <div> do input year*/}
            <div className="w-full">
              <p className="mb-2 font-medium">Data de fabricação</p>
              <Input
                type="text"
                register={register}
                name="year"
                error={errors.year?.message}
                placeholder="Exemplo: Comprado em 20/12/2025... ou Produzido em 05/12/2025..."
              />
            </div>

            {/* <div> do input validity*/}
            <div className="w-full">
              <p className="mb-2 font-medium">Validade</p>
              <Input
                type="text"
                register={register}
                name="validity"
                error={errors.validity?.message}
                placeholder="Exemplo: Válido até... ou Validade não se aplica a esse item ..."
              />
            </div>
          </div>

          {/* Div que envolve os dois inputs um ao lado do outro*/}
          <div className="flex w-full mb-3 flex-row items-center gap-4">
            {/* <div> do input year*/}
            <div className="w-full">
              <p className="mb-2 font-medium">Telefone/Whatsapp</p>
              <Input
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="Exemplo: 01299123456..."
              />
            </div>

            {/* <div> do input validity*/}
            <div className="w-full">
              <p className="mb-2 font-medium">Localização</p>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Exemplo:  Bairro: Borda da Mata, Rua Sebastião Ferreira Diniz, 49..."
              />
            </div>
          </div>

          {/* <div> do input Nome*/}
          <div className="mb-3">
            <p className="mb-2 font-medium">Preço</p>
            <Input
              type="text"
              register={register}
              name="price"
              error={errors.price?.message}
              placeholder="Exemplo: 12,98..."
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="border-2 w-full rounded-md h-24 px-2"
              {...register("description")}
              name="description"
              id="description"
              placeholder="Digite a descrição completa do item..."
            />
            {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 text-white font-medium h-10 cursor-pointer"
          >
            Cadastrar
          </button>

        </form>
      </div>

    </Container>
  )
}