var documenterSearchIndex = {"docs":
[{"location":"ModelingConcepts/#Modeling-Concepts","page":"Modeling Conecpts","title":"Modeling Concepts","text":"","category":"section"},{"location":"ModelingConcepts/#Terminal","page":"Modeling Conecpts","title":"Terminal","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"The Terminal─Connector is an important building block for every model. It represents a connection point with constant voltage in dq─cordinates u_r and u_i and enforces the kirchoff constraints sum(i_r)=0 and sum(i_i)=0.","category":"page"},{"location":"ModelingConcepts/#Modeling-of-Buses","page":"Modeling Conecpts","title":"Modeling of Buses","text":"","category":"section"},{"location":"ModelingConcepts/#Model-class-Injector","page":"Modeling Conecpts","title":"Model class Injector","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"An injector is a class of components with a single Terminal (called :terminal). Examples for injectors might be Generators, Shunts, Loads.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"     ┌───────────┐\n(t)  │           │\n o───┤  Injector │\n     │           │\n     └───────────┘","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"The current for injectors is allways in injector convention, i.e. positive currents flow out of the injector towards the terminal.","category":"page"},{"location":"ModelingConcepts/#Model:-Busbar","page":"Modeling Conecpts","title":"Model: Busbar","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"A busbar is a concrete model used in bus modeling. It represents the physical connection within a bus, the thing where all injectors and lines attach.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"           ┌──────────┐\ni_lines ──>│          │  (t)\n           │  Busbar  ├───o\n  u_bus <──│          │\n           └──────────┘","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"It has special input/output connectors which handle the network interconnection.","category":"page"},{"location":"ModelingConcepts/#Model-class-BusModel","page":"Modeling Conecpts","title":"Model class BusModel","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"A BusModel is a clase of models, which contains a single busbar (named :busbar). Optionally, it may contain various injectors and or branches (see below). It is the basis for creating Node models for NetworkDynamics.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"           ┌───────────────────────────────────┐\n           │BusModel             ┌───────────┐ │\n           │   ┌──────────┐   o──┤ Generator │ │\ni_lines ──────>│          │   │  └───────────┘ │\n           │   │  Busbar  ├───o                │\n  u_bus <──────│          │   │  ┌───────────┐ │\n           │   └──────────┘   o──│ Load      │ │\n           │                     └───────────┘ │\n           └───────────────────────────────────┘","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"Sometimes it is not possible to connect all injectors directly but instead one needs or wants Branches between the busbar and injector terminal.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"You can either create a model which satisfy the BusModel interface manually. For simple models (plain connections of a few injectors) it is possible to use the convenience method BusModel(injectors...) to create the composite model based on provide injector models.","category":"page"},{"location":"ModelingConcepts/#Line-Modeling","page":"Modeling Conecpts","title":"Line Modeling","text":"","category":"section"},{"location":"ModelingConcepts/#Model-class:-Branch","page":"Modeling Conecpts","title":"Model class: Branch","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"A branch is the two─port equivalent to an injector. I needs to have two terminals, one is called :src, the other :dst.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"Examples for branches are: PI─Model branches, dynamic RL branches or transformers.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"      ┌───────────┐\n(src) │           │ (dst)\n  o───┤  Branch   ├───o\n      │           │\n      └───────────┘","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"Both ends follow the injector interface, i.e. current leaving the device towards the terminals is always positive.","category":"page"},{"location":"ModelingConcepts/#Model:-LineEnd","page":"Modeling Conecpts","title":"Model: LineEnd","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"A LineEnd model is very similar to the BusBar model. It represents one end of a transmission line.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"          ┌───────────┐\n u_bus ──>│           │  (t)\n          │ LineEnd   ├───o\ni_line <──│           │\n          └───────────┘","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"The main differenc beeing the different input/output conventions for the network interface.","category":"page"},{"location":"ModelingConcepts/#ModelClass:-LineModel","page":"Modeling Conecpts","title":"ModelClass: LineModel","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"Similar to the BusModel, a LineModel is a model class representing a model which can be used to instantiate a transmission line model for NetworkDynamics.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"It musst contain two LineEnd instances, one called :src, one called :dst.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"         ┌────────────────────────────────────────────────┐\n         │ BranchModel      ┌──────────┐                  │\n         │  ┌─────────┐  o──┤ Branch A │──o  ┌─────────┐  │\n u_bus ────>│ LineEnd │  │  └──────────┘  │  │ LineEnd │<──── u_bus\n         │  │  :src   ├──o                o──┤  :dst   │  │\ni_line <────│         │  │  ┌──────────┐  │  │         │────> i_line\n         │  └─────────┘  o──┤ Branch B │──o  └─────────┘  │\n         │                  └──────────┘                  │\n         └────────────────────────────────────────────────┘","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"Simple line models, which consist only of valid Branch models can be instantiated using the LineModel(branches...) constructor.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"More complex models can be created manually. For example if you want to chain multiple branches between the LineEnds, for example something like","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"LineEnd(:src) ──o── Transformer ──o── Pi─Line ──o── LineEnd(:dst)","category":"page"},{"location":"ModelingConcepts/#From-MTK-Models-to-NetworkDynamics","page":"Modeling Conecpts","title":"From MTK Models to NetworkDynamics","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"Valid LineModels and BusModels can be transformed into so called Line and Bus objects.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"Line and Bus structs are no MTK models anymore, but rather containers. Currently, they mainly contain a NetworkDynamics component function (ODEVertex, StaticEdge).","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"Eventually, those models will contain more metadata. For example","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"static representation for powerflow,\npossibly local information about PU system (for transforming parameters between SI/PU),\nmeta information for initialization, for example initialization model or the information which parameters are considered \"tunable\" in order to initialize the dynamical model","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"The exact structure here is not clear yet!","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"The names are also up for disscussion. I am not to happy with the confusing names","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"Bus (Struct)  ⊃ BusModel (MTK)  ⊃ BusBar (MTK)\nLine (Struct) ⊃ LineModel (MTK) ⊃ LineEnd(s) (MTK)","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"Also there are some important naming conventions which we might need to rethink:","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Conecpts","title":"Modeling Conecpts","text":"injectors musst contain terminal named :terminal\nin each BusModel, there musst be a BusBar called :busbar, which intern has a terminal called :terminal\neach branch musst have the terminals called :src and :dst, howver\nthe LineModel posesses two LineEnds which are called :src and :dst, both of which contain a terminal called :terminal.","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = OpPoDyn","category":"page"},{"location":"#OpPoDyn","page":"Home","title":"OpPoDyn","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for OpPoDyn.","category":"page"},{"location":"#Project-Structure","page":"Home","title":"Project Structure","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The project is structured as follows","category":"page"},{"location":"","page":"Home","title":"Home","text":"OpPoDyn/\n├── assets: contains asses for reference tests\n├── docs: contains this documentation\n├── OpPoDynTesting: helper package for testing, defines test utilities like reference tests\n├── Project.toml\n├── src: source code\n│   ├── Library: submodule for library, all the models live here\n│   └── ...\n└── test: test code","category":"page"},{"location":"","page":"Home","title":"Home","text":"At this stage, this project is meant to be used with the main branch from NetworkDynamics. Unfortunately, it also depends on the unregistered subpackage OpPoDynTesting which makes instantiating the environment a bit tricky (because you can neither add NetworkDynamics#main nor OpPoDyntesting#../OpPoDynTesting without it complaining about the other dependency. Thanks to the [sources] block in Project.toml in Julia v1.11, this shouldn'te be a problem anymore.","category":"page"},{"location":"","page":"Home","title":"Home","text":"If you want to use the realse version of Julia v1.10 I suggest to create a new development environment:","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> pwd() # make sure you're in the right folder\n\".../.julia/dev/OpPoDyn\"\n\n(v1.10) pkg> activate devenv\n\n(devenv) pkg> dev NetworkDynamics\n\n(devenv) pkg> dev ./OpPoDyntesting\n\n(devenv) pkg> dev .","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [OpPoDyn]","category":"page"}]
}
