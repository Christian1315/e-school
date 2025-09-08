import { Head, Link } from '@inertiajs/react';
import logo from "../../../public/fichiers/images/logo.png";
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
                                    <a href="#" aria-current="page" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">Accueil</a>
                                    <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Team</a>
                                    <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Projects</a>
                                    <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Calendar</a>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex space-x-2 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            {!auth.user ? (
                                <>
                                    <Link href="#" className="btn btn-sm rounded-md shadow-sm border bg-success text-white bg-hover">
                                        <i className="bi bi-person-lock"></i> Connexion
                                    </Link>
                                    <Link className="btn btn-sm rounded-md shadow-sm border bg-warning-opacity bg-hover">
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
                                    <h3 className="uk-margin-remove">École Moderne</h3>
                                    <p className="uk-margin-remove">Un environnement d'apprentissage innovant et dynamique.</p>
                                    <br />
                                    <Link href="#" className="flex space-x-2 btn btn-lg rounded shadow-sm border bg-light text-success transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500">
                                        <span className="">
                                            <i className="bi bi-person-plus"></i> Créer un compte
                                        </span>
                                        <span class="relative flex size-3">
                                            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75"></span>
                                            <span class="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <img src={slide3} alt="Slide 3" data-uk-cover />
                                <div className="uk-overlay uk-overlay-primary uk-position-left uk-text-center uk-transition-slide-right flex flex-col justify-center items-center h-full">
                                    <h3 className="uk-margin-remove">Équipe Pédagogique</h3>
                                    <p className="uk-margin-remove">Des enseignants passionnés et engagés pour la réussite.</p>
                                    <br />
                                    <Link href="#" className="flex space-x-2 btn btn-lg rounded shadow-sm border bg-light text-success transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500">
                                        <span className="">
                                            <i className="bi bi-person-plus"></i> Créer un compte
                                        </span>
                                        <span class="relative flex size-3">
                                            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75"></span>
                                            <span class="relative inline-flex size-3 rounded-full bg-sky-500"></span>
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

            {/*  */}
            <div className="row section px-0 mx-0">
                <div className="col-md-6 text-justify">
                    <i class="bi bi-1-square"></i>  <h2 className="text-center"> A Propos de nous</h2>
                    <p className="">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure modi, magnam a quis rem sequi, officia incidunt alias quasi ex aperiam, similique dignissimos cum voluptatibus dolor molestiae aut et veritatis?
                        Nostrum quibusdam suscipit nisi ipsam doloribus quisquam, culpa atque. Reiciendis eaque voluptate sint modi nobis libero rerum eius, deserunt vitae facilis labore debitis maxime in repellendus explicabo sit! Ab, culpa!
                        Adipisci, obcaecati numquam repudiandae consequatur tenetur nihil doloremque quidem iste ex repellendus quam, qui laborum eaque. Modi doloremque atque officiis aliquam facilis quos deleniti repellat quidem deserunt, et voluptatem laudantium!</p>
                </div>
                <div className="col-md-6">
                    <iframe class="aspect-video " src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>
                </div>
            </div>
        </>
    );
}
