import { useEffect, useState } from "react"
import { Container } from "../../components/container"
import { FaWhatsapp } from "react-icons/fa"
import { useParams, useNavigate } from "react-router-dom" // Importe o useParams para pegarmos os parâmetros da URL, neste caso o id do produto.

import { getDoc, doc } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"

import { Swiper, SwiperSlide } from 'swiper/react';

import imgTorta from '../../assets/images/torta.jpg';
import imgTorta2 from '../../assets/images/torta2.jpg';
import imgTorta3 from '../../assets/images/torta3.jpg';

interface ItemProps {
    id: string;
    name: string;
    categorie: string;
    city: string;
    year: string;
    validity: string;
    description: string;
    created: string;
    price: string | number;
    owner: string;
    uid: string;
    whatsapp: string;
    images: ImageItemProps[];
}

interface ImageItemProps {
    uid: string;
    name: string;
    url: string;
}


export function ItemDetail() {
    const { id } = useParams(); //Sabemos que o parâmetro dele é id pois quando criamos a rota (/item/:id) no arquivo App.tsx, o id era o parâmetro.
    const [item, setItem] = useState<ItemProps>();
    const [sliderPerView, setSliderPerView] = useState<number>(2); //aqui eu informo que eu quero que comecemos com dois slides já aparecendo na tela.
    const navigate = useNavigate();


    useEffect(() => {
        async function loadItem() {
            if (!id) { return; } //Se não tiver um id na rota, ele para a execução e nem tenta buscar algo.

            const docRef = doc(db, "products", id);
            getDoc(docRef)
                .then(snapshot => {

                    // if (!snapshot.data()) {
                    //     navigate("/")
                    // }

                    setItem({
                        id: snapshot.id,
                        name: snapshot.data()?.name,
                        year: snapshot.data()?.year,
                        city: snapshot.data()?.city,
                        categorie: snapshot.data()?.categorie,
                        uid: snapshot.data()?.uid,
                        description: snapshot.data()?.description,
                        created: snapshot.data()?.created,
                        whatsapp: snapshot.data()?.whatsapp,
                        price: snapshot.data()?.price,
                        validity: snapshot.data()?.validity,
                        owner: snapshot.data()?.owner,
                        images: snapshot.data()?.images
                    })
                })
        }
        loadItem();

    }, [id])//Precisamos passar o id como dependência pois eu preciso do id da rota para que ele busque no banco. 


    //useEffect abaixo serve para controlar a quantidade de slides que aparecerão na tela, dependendo da largura da tela.
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 720) {
                setSliderPerView(1);
            } else {
                setSliderPerView(2);
            }
        }


        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [])

    return (
        <Container>

            {/*Início Main dinâmica */}
            {/* {item && (
                <Swiper
                    slidesPerView={sliderPerView}
                    pagination={{ clickable: true }}
                    navigation
                >
                    {item?.images.map(image => (
                        <SwiperSlide key={image.name}>
                            <img
                                src={image.url}
                                className="w-full h-96 object-cover"
                            //alt={image.name} 
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {item && (
                <main className="w-full bg-white rounded-lg p-6 my-4">
                    <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
                        <h1 className="font-bold text-3xl text-black">{item?.name}</h1>
                        <h1 className="font-bold text-3xl text-black">R$ {item?.price}</h1>
                    </div>

                    <p>{item?.categorie}</p>

                    <div className="flex w-full gap-6 my-4">
                        <div className="flex flex-col gap-4">
                            <div>
                                <p>Cidade</p>
                                <strong>{item?.city}</strong>
                            </div>

                            <div>
                                <p>Data</p>
                                <strong>{item?.year}</strong>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <p>Validade</p>
                                <strong>{item?.validity}</strong>
                            </div>
                        </div>
                    </div>

                    <strong>Descrição:</strong>
                    <p className="mb-4">{item?.description}</p>


                    <strong>Telefone / Whatsapp:</strong> <strong>{item?.whatsapp}</strong>
                    <p>{item?.whatsapp}</p>

                    <a
                        href={`https://api.whatsapp.com/send?phone=55${item?.whatsapp}&text=Olá vi esse ${item?.name} e fiquei interessado(a).`}
                        target="_blank"
                        className="bg-green-500 hover:bg-green-700 text-white flex items-center justify-center gap-2 my-6 h-11 py-2 px-4 rounded-lg mt-4 font-medium transition duration-150 ease-in-out"
                    >
                        Conversar com vendedor
                        <FaWhatsapp size={26} color="#FFF" />
                    </a>

                </main>
            )} */}
            {/*Fim Main dinâmica */}



            {/*Início Main estática */}
            <Swiper
                slidesPerView={sliderPerView}
                pagination={{ clickable: true }}
                navigation
            >
                <SwiperSlide>
                    <img
                        src={imgTorta}
                        className="w-full h-96 object-cover"
                    //alt={image.name} 
                    />
                </SwiperSlide>

                <SwiperSlide>
                    <img
                        src={imgTorta2}
                        className="w-full h-96 object-cover"
                    //alt={image.name} 
                    />
                </SwiperSlide>

                <SwiperSlide>
                    <img
                        src={imgTorta3}
                        className="w-full h-96 object-cover"
                    //alt={image.name} 
                    />
                </SwiperSlide>

            </Swiper>

            {item && (
                <main className="w-full bg-white rounded-lg p-6 my-4">
                    <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
                        <h1 className="font-bold text-3xl text-black">Torta de frango caseira</h1>
                        <h1 className="font-bold text-3xl text-black">R$ 8,00</h1>
                    </div>

                    <p>{item?.categorie}</p>

                    <div className="flex w-full gap-6 my-4">
                        <div className="flex flex-col gap-4">
                            <div>
                                <p>Cidade</p>
                                <strong>Borda da Mata - Rua Sebastião Ferreira Diniz, 49</strong>
                            </div>

                            <div>
                                <p>Validade</p>
                                <strong>Consumir em até 4 dias  </strong>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <p>Data</p>
                                <strong>Feita em 13/04/2025</strong>
                            </div>
                        </div>
                    </div>

                    <strong>Descrição:</strong>
                    <p className="mb-4">Deliciosa torta de frango, feita com uma massa leve e douradinha, recheada com um cremoso e suculento frango desfiado, temperado com ervas finas, cebola, alho, milho e um toque especial de requeijão. Perfeita para qualquer ocasião, essa torta é um clássico que agrada a todos os paladares!</p>

                    <strong>Telefone / Whatsapp:</strong> <strong>{item?.whatsapp}</strong>
                    <p>12998764549</p>

                    <a
                        href={`https://api.whatsapp.com/send?phone=55${item?.whatsapp}&text=Olá vi essa Torta de frango caseira e fiquei interessado(a).`}
                        target="_blank"
                        className="bg-green-500 hover:bg-green-700 text-white flex items-center justify-center gap-2 my-6 h-11 py-2 px-4 rounded-lg mt-4 font-medium transition duration-150 ease-in-out"
                    >
                        Conversar com vendedor
                        <FaWhatsapp size={26} color="#FFF" />
                    </a>
                </main>
            )}
            {/*Fim Main estática */}


        </Container>
    )
}


