import { Head, Link } from '@inertiajs/react';
import logo from "../../../public/fichiers/images/logo.png";
import icon from "../../../public/fichiers/images/icon.png";
import icon2 from "../../../public/fichiers/images/icon2.png";
import slide3 from "../../../public/fichiers/images/slides/school1.jpg";
import slide2 from "../../../public/fichiers/images/slides/school2.jpg";
import slide1 from "../../../public/fichiers/images/slides/school3.jpg";


export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Accueil" />

            {/* Nav */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md" >
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <button type="button" command="--toggle" commandfor="mobile-menu" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" className="size-6 in-aria-expanded:hidden">
                                    <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" className="size-6 not-in-aria-expanded:hidden">
                                    <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex shrink-0 items-center">
                                <img src={logo} alt="E-School" className="h-10 w-auto" />
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    <a href="#" aria-current="page" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"><i class="bi bi-houses"></i> Accueil</a>
                                    <a href="#banner" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"><i class="bi bi-people"></i> A Propos</a>
                                    <a href="#partners" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"><i class="bi bi-people"></i> Partenaires</a>
                                    <a href="#newsletter" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"><i class="bi bi-person-lines-fill"></i> Contact</a>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex space-x-2 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            {!auth.user ? (
                                <>
                                    <Link href="/login" className="btn btn-sm rounded-md shadow-sm border bg-success text-white bg-hover">
                                        <i className="bi bi-person-lock"></i> Connexion
                                    </Link>
                                    <Link href="/register" className="btn btn-sm rounded-md shadow-sm border bg-warning-opacity bg-hover">
                                        <i className="bi bi-person-plus"></i> Créer un compte
                                    </Link>
                                </>
                            ) : (
                                <Link className="btn btn-sm rounded-md shadow-sm border bg-warning-opacity bg-hover">
                                    <i className="bi bi-house-up"></i> Tableau de board
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Banniere */}
            <div className="row px-0 mx-0 mt-5">
                <div className="col-12 px-0 mx-0">
                    <div id="banner" uk-slideshow="autoplay: true;autoplay-interval: 3000;pause-on-hover: true" className="uk-position-relative uk-visible-toggle uk-light px-0 mx-0" tabIndex="-1" data-uk-slideshow="animation: fade">
                        <div className="uk-slideshow-items">
                            <div>
                                <img src={slide1} alt="Slide 1" className="" data-uk-cover />
                                <div className="uk-overlay uk-overlay-primary uk-position-left uk-text-center uk-transition-slide-bottom flex flex-col justify-center items-center h-full">
                                    <h3 className="uk-margin-remove section-title">École Moderne</h3>
                                    <p className="uk-margin-remove">Un environnement d'apprentissage innovant et dynamique.</p>
                                    <br />
                                    <Link
                                        href={route("register")}
                                        className="flex space-x-2 btn btn-lg rounded shadow-sm border bg-light text-success transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                                        uk-scrollspy="cls: uk-animation-slide-top; repeat: true">
                                        <span className="">
                                            <i className="bi bi-person-plus"></i> Créer un compte
                                        </span>
                                        <span className="relative flex size-3">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75"></span>
                                            <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <img src={slide3} alt="Slide 3" data-uk-cover />
                                <div className="uk-overlay uk-overlay-primary uk-position-left uk-text-center uk-transition-slide-right flex flex-col justify-center items-center h-full">
                                    <h3 className="uk-margin-remove section-title">Équipe Pédagogique</h3>
                                    <p className="uk-margin-remove">Des enseignants passionnés et engagés pour la réussite.</p>
                                    <br />
                                    <Link
                                        href={route("register")}
                                        className="flex space-x-2 btn btn-lg rounded shadow-sm border bg-light text-success transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                                        uk-scrollspy="cls: uk-animation-slide-top; repeat: true">
                                        <span className="">
                                            <i className="bi bi-person-plus"></i> Créer un compte
                                        </span>
                                        <span className="relative flex size-3">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75"></span>
                                            <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <a className="uk-position-center-left uk-position-small uk-hidden-hover text-success btn btn-sm rounded-md border bg-light" href="#" data-uk-slidenav-previous data-uk-slideshow-item="previous"></a>
                        <a className="uk-position-center-right uk-position-small uk-hidden-hover text-success btn btn-sm rounded-md border bg-light" href="#" data-uk-slidenav-next data-uk-slideshow-item="next"></a>
                    </div>
                </div>
            </div>

            {/*  About Us */}
            <div className="row section px-0 mx-0">
                <div className="col-md-6 text-justify">
                    <h2 className="text-center section-title box-border"> <img src={icon} alt="" srcSet="" /> A Propos de nous</h2>
                    <hr />
                    <p className=""><strong>Lorem ipsum</strong> , dolor sit amet consectetur adipisicing elit. Iure modi, magnam a quis rem sequi, officia incidunt alias quasi ex aperiam, similique dignissimos cum voluptatibus dolor molestiae aut et veritatis?
                        Nostrum quibusdam suscipit nisi ipsam doloribus quisquam, culpa atque. Reiciendis eaque voluptate sint modi nobis libero rerum eius, deserunt vitae facilis labore debitis maxime in repellendus explicabo sit! Ab, culpa!
                        Adipisci, obcaecati numquam repudiandae consequatur tenetur nihil doloremque quidem iste ex repellendus quam,!</p>
                </div>
                <div className="col-md-6 align-items-center">
                    <div className="relative">
                        {/* Fond décalé */}
                        <div
                            className="absolute top-0 left-0 w-full h-full bg-warning decorative-bg"
                            style={{ transform: "rotate(-3deg)", zIndex: 0, borderRadius: "15px" }}
                        ></div>

                        {/* Contenu au-dessus */}
                        <div
                            className="relative z-10"
                            data-uk-scrollspy="cls: uk-animation-slide-bottom; repeat: false"
                        >
                            <iframe
                                className="aspect-video rounded-lg shadow-sm video-frame w-full"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                title="YouTube video"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            {/*  Call to action */}
            <div className="row section px-0 mx-0" id='collToAction'>
                <div className="col-12 uk-height-large uk-background-cover uk-overflow-hidden uk-light uk-flex layer">
                    <div className="row d-flex justify-content-center align-items-center">
                        <div className="col-6">
                            <div className="uk-text-center uk-margin-auto ">

                                <h2 data-uk-parallax="opacity: 0,1; y: -100,0; scale: 2,1; end: 50vh + 50%;"
                                    className="text-center section-title box-border"> <img src={icon} alt="" srcSet="" />Inscrivez-vous !</h2>
                                {/* <br /> */}
                                <p
                                    data-uk-parallax="opacity: 0,1; y: 100,0; scale: 0.5,1; end: 50vh + 50%;">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua.

                                    <br /><br />
                                    <Link
                                        href="#"
                                        className="text-center space-x-3  btn btn-lg rounded shadow-sm border bg-light text-success transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                                        uk-scrollspy="cls: uk-animation-slide-top; repeat: true">
                                        <span className="">
                                            <i className="bi bi-person-plus"></i> Créer un compte
                                        </span>
                                        <span className="relative flex size-3">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75"></span>
                                            <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                                        </span>
                                    </Link>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/*  Partenaires */}
            <div className="row section px-0 mx-0 d-flex justify-content-center align-items-center" id='partners'>
                <div className="col-md-8">
                    <h1 className="section-title"> <img src={icon2} alt="" srcSet="" /> Nos Partenaires</h1>
                    <div uk-scrollspy="target: > div; cls: uk-animation-fade; delay: 500">
                        <div className="relative inline-block m-1">
                            {/* Fond décalé */}
                            <div
                                className="absolute bg-white decorative-bg"
                                style={{
                                    top: "20px",          // décale vers le bas
                                    left: "0",
                                    width: "200px",       // même largeur que l’image
                                    height: "200px",      // même hauteur pour garder un cercle
                                    borderRadius: "50%",  // cercle
                                    transform: "rotate(-3deg)",
                                    zIndex: 0,
                                }}
                            ></div>

                            {/* Contenu au-dessus */}
                            <div
                                className="relative z-10"
                                data-uk-scrollspy="cls: uk-animation-slide-bottom; repeat: false"
                            >
                                <img
                                    src={slide1}
                                    alt=""
                                    className="img-fluid relative shadow"
                                    style={{
                                        width: "200px",
                                        height: "200px",
                                        borderRadius: "50%",   // cercle
                                        objectFit: "cover",    // recadre bien l’image
                                        border: "5px solid white", // bordure blanche
                                    }}
                                />
                            </div>
                        </div>

                        <div className="relative inline-block m-1">
                            {/* Fond décalé */}
                            <div
                                className="absolute bg-white decorative-bg"
                                style={{
                                    top: "20px",          // décale vers le bas
                                    left: "0",
                                    width: "200px",       // même largeur que l’image
                                    height: "200px",      // même hauteur pour garder un cercle
                                    borderRadius: "50%",  // cercle
                                    transform: "rotate(-3deg)",
                                    zIndex: 0,
                                }}
                            ></div>

                            {/* Contenu au-dessus */}
                            <div
                                className="relative z-10"
                                data-uk-scrollspy="cls: uk-animation-slide-bottom; repeat: false"
                            >
                                <img
                                    src={slide1}
                                    alt=""
                                    className="img-fluid relative shadow"
                                    style={{
                                        width: "200px",
                                        height: "200px",
                                        borderRadius: "50%",   // cercle
                                        objectFit: "cover",    // recadre bien l’image
                                        border: "5px solid white", // bordure blanche
                                    }}
                                />
                            </div>
                        </div>

                        <div className="relative inline-block m-1">
                            {/* Fond décalé */}
                            <div
                                className="absolute bg-white decorative-bg"
                                style={{
                                    top: "20px",          // décale vers le bas
                                    left: "0",
                                    width: "200px",       // même largeur que l’image
                                    height: "200px",      // même hauteur pour garder un cercle
                                    borderRadius: "50%",  // cercle
                                    transform: "rotate(-3deg)",
                                    zIndex: 0,
                                }}
                            ></div>

                            {/* Contenu au-dessus */}
                            <div
                                className="relative z-10"
                                data-uk-scrollspy="cls: uk-animation-slide-bottom; repeat: false"
                            >
                                <img
                                    src={slide1}
                                    alt=""
                                    className="img-fluid relative shadow"
                                    style={{
                                        width: "200px",
                                        height: "200px",
                                        borderRadius: "50%",   // cercle
                                        objectFit: "cover",    // recadre bien l’image
                                        border: "5px solid white", // bordure blanche
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*  Newsletter */}
            <div className="row section px-0 mx-0" id='newsletter' data-uk-scrollspy="cls: uk-animation-slide-bottom; repeat: false">
                <div className="col-md-12 layer">
                    <div className="row d-flex justify-content-center align-items-center">
                        <div className="col-md-6 p-3">
                            <h2 className="text-center section-title text-white box-border" data-uk-scrollspy="cls: uk-animation-slide-top; repeat: true"> <img src={icon} alt="" srcSet="" />Restez informé!</h2>
                            {/* <br /> */}
                            <br /><br />
                            <form action="" method="post" className='border border-white p-3 rounded shadow-sm' style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div class="mb-3">
                                            <label for="exampleFormControlInput1" class="form-label text-white">Email address</label>
                                            <input type="email" class="form-control shadow-sm rounded bg-transparent text-white border-white" autoFocus id="exampleFormControlInput1" placeholder="name@example.com" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div class="mb-3">
                                            <label for="exampleFormControlInput1" class="form-label text-white">Email address</label>
                                            <input type="email" class="form-control shadow-sm rounded bg-transparent text-white border-white" id="exampleFormControlInput1" placeholder="name@example.com" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div class="mb-3">
                                            <label for="exampleFormControlInput1" class="form-label text-white">Email address</label>
                                            <input type="email" class="form-control shadow-sm rounded bg-transparent text-white border-white" id="exampleFormControlInput1" placeholder="name@example.com" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div class="mb-3">
                                            <label for="exampleFormControlInput1" class="form-label text-white">Email address</label>
                                            <input type="email" class="form-control shadow-sm rounded bg-transparent text-white border-white" id="exampleFormControlInput1" placeholder="name@example.com" />
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="exampleFormControlTextarea1" class="form-label text-white">Example textarea</label>
                                    <textarea class="form-control shadow-sm rounded bg-transparent text-white border-white" id="exampleFormControlTextarea1" rows="3"></textarea>
                                </div>

                                <div className="flex justify-content-center">
                                    <button
                                        className="text-center space-x-3  btn btn-lg w-50 rounded shadow-sm border bg-light text-success transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                                        uk-scrollspy="cls: uk-animation-slide-bottom; repeat: true">
                                        <span className="">
                                            <i class="bi bi-check2-circle"></i> Envoyer
                                        </span>
                                        <span className="relative flex size-3">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75"></span>
                                            <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>

            {/*  Testimony */}
            <div className="row section px-0 mx-0 d-flex justify-content-center align-items-center" id='tertimonies'>
                <div className="col-md-6">
                    <div className="rounded-lg shadow-sm border">
                        <div className="text-center">
                            <h1 className="section-title">Témoignages</h1>
                        </div>
                        {/*  */}
                        <div className='' uk-slideshow="animation: push">

                            <div class="uk-position-relative uk-visible-toggle uk-light" tabindex="-1">

                                <div class="uk-slideshow-items">
                                    <div>
                                        <section className="relative isolate overflow-hidden bg-white px-6 py-5 sm:py-32 lg:px-8"
                                            uk-cover>
                                            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-100),white)] opacity-20"></div>
                                            <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"></div>
                                            <div className="mx-auto max-w-2xl lg:max-w-4xl">
                                                <img src="https://tailwindcss.com/plus-assets/img/logos/workcation-logo-indigo-600.svg" alt="" className="mx-auto h-12" />
                                                <figure className="mt-10">
                                                    <blockquote className="text-dark text-center text-xl/8 font-semibold text-gray-900 sm:text-2xl/9">
                                                        <p>“Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.”</p>
                                                    </blockquote>
                                                    <figcaption className="mt-10">
                                                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="mx-auto size-10 rounded-full" />
                                                        <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                                                            <div className="font-semibold text-gray-900">Judith Black</div>
                                                            <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" className="fill-gray-900">
                                                                <circle r="1" cx="1" cy="1" />
                                                            </svg>
                                                            <div className="text-gray-600">CEO of Workcation</div>
                                                        </div>
                                                    </figcaption>
                                                </figure>
                                            </div>
                                        </section>
                                    </div>
                                    <div>
                                        <section className="relative isolate overflow-hidden bg-white px-6 py-5 sm:py-32 lg:px-8"
                                            uk-cover>
                                            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-100),white)] opacity-20"></div>
                                            <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"></div>
                                            <div className="mx-auto max-w-2xl lg:max-w-4xl">
                                                <img src="https://tailwindcss.com/plus-assets/img/logos/workcation-logo-indigo-600.svg" alt="" className="mx-auto h-12" />
                                                <figure className="mt-10">
                                                    <blockquote className="text-dark text-center text-xl/8 font-semibold text-gray-900 sm:text-2xl/9">
                                                        <p>“Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.”</p>
                                                    </blockquote>
                                                    <figcaption className="mt-10">
                                                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="mx-auto size-10 rounded-full" />
                                                        <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                                                            <div className="font-semibold text-gray-900">Judith Black</div>
                                                            <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" className="fill-gray-900">
                                                                <circle r="1" cx="1" cy="1" />
                                                            </svg>
                                                            <div className="text-gray-600">CEO of Workcation</div>
                                                        </div>
                                                    </figcaption>
                                                </figure>
                                            </div>
                                        </section>
                                    </div>
                                    <div>
                                        <section className="relative isolate overflow-hidden bg-white px-6 py-5 sm:py-32 lg:px-8"
                                            uk-cover>
                                            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-100),white)] opacity-20"></div>
                                            <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"></div>
                                            <div className="mx-auto max-w-2xl lg:max-w-4xl">
                                                <img src="https://tailwindcss.com/plus-assets/img/logos/workcation-logo-indigo-600.svg" alt="" className="mx-auto h-12" />
                                                <figure className="mt-10">
                                                    <blockquote className="text-dark text-center text-xl/8 font-semibold text-gray-900 sm:text-2xl/9">
                                                        <p>“Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.”</p>
                                                    </blockquote>
                                                    <figcaption className="mt-10">
                                                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="mx-auto size-10 rounded-full" />
                                                        <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                                                            <div className="font-semibold text-gray-900">Judith Black</div>
                                                            <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" className="fill-gray-900">
                                                                <circle r="1" cx="1" cy="1" />
                                                            </svg>
                                                            <div className="text-gray-600">CEO of Workcation</div>
                                                        </div>
                                                    </figcaption>
                                                </figure>
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                <a class="uk-position-center-left uk-position-small uk-hidden-hover" href uk-slidenav-previous uk-slideshow-item="previous"></a>
                                <a class="uk-position-center-right uk-position-small uk-hidden-hover" href uk-slidenav-next uk-slideshow-item="next"></a>

                            </div>

                            <ul class="uk-slideshow-nav uk-dotnav uk-flex-center uk-margin"></ul>

                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- footer --> */}
            <div class="row section bg-light shadow-sm p-3  px-0 mx-0" id='footer'>
                <div className="col-md-12">
                    <p style={{fontSize:"12px"}} className="text-center">@Copyright <strong class="badge bg-light text-success border">{new Date().getFullYear()}</strong> | Tous droits réservés | Réalisé par <strong class="badge bg-light text-success border">Code4Christ</strong> </p>
                </div>
            </div>
        </>
    );
}
