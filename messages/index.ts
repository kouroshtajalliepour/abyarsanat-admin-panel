import basicEn from "./basic/en"
import basicFa from "./basic/fa"
import enLinks from "./links/en"
import faLinks from "./links/fa"
import enPages from "./pages/en"
import faPages from "./pages/fa"
import faEntities from "./entities/fa"
import enEntities from "./entities/en"
import enUseCases from "./useCases/en"
import faUseCases from "./useCases/fa"

export default {
    en: {
        projectName: "Abyar Sanaat",
        ...basicEn,
        links: enLinks,
        pages: enPages,
        entities: enEntities,
        useCases: enUseCases,
    },
    fa: {
        projectName: "ماویدا هوم",
        ...basicFa,
        links: faLinks,
        pages: faPages,
        entities: faEntities,
        useCases: faUseCases,
    }
}