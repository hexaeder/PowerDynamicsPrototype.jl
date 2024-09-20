var documenterSearchIndex = {"docs":
[{"location":"ModelingConcepts/#Modeling-Concepts","page":"Modeling Concepts","title":"Modeling Concepts","text":"","category":"section"},{"location":"ModelingConcepts/#Terminal","page":"Modeling Concepts","title":"Terminal","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"The Terminal─Connector is an important building block for every model. It represents a connection point with constant voltage in dq─cordinates u_r and u_i and enforces the kirchoff constraints sum(i_r)=0 and sum(i_i)=0.","category":"page"},{"location":"ModelingConcepts/#Modeling-of-Buses","page":"Modeling Concepts","title":"Modeling of Buses","text":"","category":"section"},{"location":"ModelingConcepts/#Model-class-Injector","page":"Modeling Concepts","title":"Model class Injector","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"An injector is a class of components with a single Terminal() (called :terminal). Examples for injectors might be Generators, Shunts, Loads.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"      ┌───────────┐\n(t)   │           │\n o←───┤  Injector │\n      │           │\n      └───────────┘","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"The current for injectors is always in injector convention, i.e. positive currents flow out of the injector towards the terminal.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"note: Model classes\nModel \"classes\" are nothing formalized. In this document, a model class is just a description for some ODESystem from ModelingToolkit.jl, which satisfies certain requirements. For example, any ODESystem is considered an \"Injector\" if it contains a connector Terminal() called :terminal.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"details: Code example: definition of PQ load as injector\nusing OpPoDyn, OpPoDyn.Library, ModelingToolkit\n@mtkmodel MyPQLoad begin\n    @components begin\n        terminal = Terminal()\n    end\n    @parameters begin\n        Pset, [description=\"Active Power demand\"]\n        Qset, [description=\"Reactive Power demand\"]\n    end\n    @variables begin\n        P(t), [description=\"Active Power\"]\n        Q(t), [description=\"Reactive Power\"]\n    end\n    @equations begin\n        P ~ terminal.u_r*terminal.i_r + terminal.u_i*terminal.i_i\n        Q ~ terminal.u_i*terminal.i_r - terminal.u_r*terminal.i_i\n        # if possible, its better for the solver to explicitly provide algebraic equations for the current\n        terminal.i_r ~ (Pset*terminal.u_r + Qset*terminal.u_i)/(terminal.u_r^2 + terminal.u_i^2)\n        terminal.i_i ~ (Pset*terminal.u_i - Qset*terminal.u_r)/(terminal.u_r^2 + terminal.u_i^2)\n    end\nend\nMyPQLoad(name=:pqload) #hide\nnothing #hide","category":"page"},{"location":"ModelingConcepts/#Model-class-MTKBus","page":"Modeling Concepts","title":"Model class MTKBus","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"A MTKBus isa class of models, which are used to describe the dynamic behavior of a full bus in a power grid. Each MTKBus musst contain a predefined model of type BusBar() (named :busbar). This busbar represents the connection point to the grid. Optionally, it may contain various injectors.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":" ┌───────────────────────────────────┐\n │ MTKBus             ┌───────────┐  │\n │  ┌──────────┐   ┌──┤ Generator │  │\n │  │          │   │  └───────────┘  │\n │  │  BusBar  ├───o                 │\n │  │          │   │  ┌───────────┐  │\n │  └──────────┘   └──┤ Load      │  │\n │                    └───────────┘  │\n └───────────────────────────────────┘","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"Sometimes it is not possible to connect all injectors directly but instead one needs or wants Branches between the busbar and injector terminal. As long as the :busbar is present at the toplevel, there are few limitations on the overall model complexity.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"For simple models (direct connections of a few injectors) it is possible to use the convenience method MTKBus(injectors...) to create the composite model based on provide injector models.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"details: Code example: definition of a Bus containing a swing equation and a load\nusing OpPoDyn, OpPoDyn.Library, ModelingToolkit\n@mtkmodel MyMTKBus begin\n    @components begin\n        busbar = BusBar()\n        swing = Swing()\n        load = PQLoad()\n    end\n    @equations begin\n        connect(busbar.terminal, swing.terminal)\n        connect(busbar.terminal, load.terminal)\n    end\nend\nMyMTKBus(name=:bus) #hide\nnothing #hideAlternativly, for that system you could have just calledmybus = MTKBus(Swing(;name=:swing), PQLoad(;name=:load))\nnothing #hideto get an instance of a model which is structually aquivalent to MyMTKBus.","category":"page"},{"location":"ModelingConcepts/#Line-Modeling","page":"Modeling Concepts","title":"Line Modeling","text":"","category":"section"},{"location":"ModelingConcepts/#Model-class-Branch","page":"Modeling Concepts","title":"Model class Branch","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"A branch is the two-port equivalent to an injector. I needs to have two Terminal()s, one is called :src, the other :dst.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"Examples for branches are: PI─Model branches, dynamic RL branches or transformers.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"      ┌───────────┐\n(src) │           │ (dst)\n  o←──┤  Branch   ├──→o\n      │           │\n      └───────────┘","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"Both ends follow the injector interface, i.e. current leaving the device towards the terminals is always positive.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"details: Code example: algebraic R-line\nusing OpPoDyn, OpPoDyn.Library, ModelingToolkit\n@mtkmodel MyRLine begin\n    @components begin\n        src = Terminal()\n        dst = Terminal()\n    end\n    @parameters begin\n        R=0, [description=\"Resistance\"]\n    end\n    @equations begin\n        dst.i_r ~ (dst.u_r - src.u_r)/R\n        dst.i_i ~ (dst.u_i - src.u_i)/R\n        src.i_r ~ -dst.i_r\n        src.i_i ~ -dst.i_i\n    end\nend\nMyRLine(name=:rline) #hide\nnothing #hide","category":"page"},{"location":"ModelingConcepts/#Model-class:-MTKLine","page":"Modeling Concepts","title":"Model class: MTKLine","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"Similar to the MTKBus, a MTKLine is a model class which represents a transmission line in the network.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"It musst contain two LineEnd() instances, one called :src, one called :dst.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":" ┌────────────────────────────────────────────────┐\n │ MTKLine          ┌──────────┐                  │\n │  ┌─────────┐  ┌──┤ Branch A │──┐  ┌─────────┐  │\n │  │ LineEnd │  │  └──────────┘  │  │ LineEnd │  │\n │  │  :src   ├──o                o──┤  :dst   │  │\n │  │         │  │  ┌──────────┐  │  │         │  │\n │  └─────────┘  └──┤ Branch B │──┘  └─────────┘  │\n │                  └──────────┘                  │\n └────────────────────────────────────────────────┘","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"Simple line models, which consist only of valid Branch models can be instantiated using the MTKLine(branches...) constructor.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"More complex models can be created manually. For example if you want to chain multiple branches between the LineEnds, for example something like","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"LineEnd(:src) ──o── Transformer ──o── Pi─Line ──o── LineEnd(:dst)","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"details: Code example: Transmission line with two pi-branches\nusing OpPoDyn, OpPoDyn.Library, ModelingToolkit\n@mtkmodel MyMTKLine begin\n    @components begin\n        src = LineEnd()\n        dst = LineEnd()\n        branch1 = DynawoPiLine()\n        branch2 = DynawoPiLine()\n    end\n    @equations begin\n        connect(src.terminal, branch1.src)\n        connect(src.terminal, branch2.src)\n        connect(dst.terminal, branch1.dst)\n        connect(dst.terminal, branch2.dst)\n    end\nend\nMyMTKLine(name=:mtkline) #hide\nnothing #hideAlternatively, an equivalent model with multiple valid branch models in parallel could be created and instantiated with the convenience constructorline = MTKLine(DynawoPiLine(;name=:branch1), DynawoPiLine(;name=:branch2))\nnothing #hide","category":"page"},{"location":"ModelingConcepts/#From-MTK-Models-to-NetworkDynamics","page":"Modeling Concepts","title":"From MTK Models to NetworkDynamics","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"Valid MTKLine and MTKBus can be transformed into so called Line and Bus objects.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"Line and Bus structs are no MTK models anymore, but rather containers. Currently, they mainly contain a NetworkDynamics component function (ODEVertex, StaticEdge).","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"Eventually, those models will contain more metadata. For example","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"static representation for powerflow,\npossibly local information about PU system (for transforming parameters between SI/PU),\nmeta information for initialization, for example initialization model or the information which parameters are considered \"tunable\" in order to initialize the dynamical model","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"The exact structure here is not clear yet!","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"The result would look something like that:","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"using OpPoDyn, OpPoDyn.Library, ModelingToolkit\nusing Graphs, NetworkDynamics\nusing OrdinaryDiffEqRosenbrock, OrdinaryDiffEqNonlinearSolve\nusing CairoMakie\nnothing #hide","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"Define a swing bus with load","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"# define injectors\n@named swing = Swing(; Pm=1)\n@named load = PQLoad(; Pset=-.5, Qset=0)\nbus1mtk = MTKBus(swing, load; name=:swingbus)\nbus1 = Bus(bus1mtk)\nvertex1f = bus1.compf # extract component function","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"Define a second bus as a slack","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"bus2mtk = SlackDifferential(; name=:slackbus)\nbus2 = Bus(bus2mtk)\nvertex2f = bus2.compf # extract component function","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"Define the powerline connecting both nodes","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"@named branch1 = DynawoPiLine()\n@named branch2 = DynawoPiLine()\nlinemtk = MTKLine(branch1, branch2; name=:powerline)\nline = Line(linemtk)\nedgef = line.compf # extract component function","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"Define the graph, the network and extract initial conditions","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"g = complete_graph(2)\nnw = Network(g, [vertex1f, vertex2f], edgef)\nu0 = NWState(nw) # extract parameters and state from modesl","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"Then we can solve the problem","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"prob = ODEProblem(nw, uflat(u0), (0,1), pflat(u0))\nsol = solve(prob, Rodas5P())\nnothing #hide","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"And finally we can plot the solution:","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"fig = Figure();\nax = Axis(fig[1,1])\nlines!(ax, sol; idxs=VIndex(1,:busbar₊P), label=\"Power injection Bus\", color=Cycled(1))\nlines!(ax, sol; idxs=VIndex(1,:swing₊Pel), label=\"Power injection Swing\", color=Cycled(2))\nlines!(ax, sol; idxs=VIndex(1,:load₊P), label=\"Power injection load\", color=Cycled(3))\naxislegend(ax)\n\nax = Axis(fig[2,1])\nlines!(ax, sol; idxs=VIndex(1,:busbar₊u_arg), label=\"swing bus voltage angle\", color=Cycled(1))\nlines!(ax, sol; idxs=VIndex(2,:busbar₊u_arg), label=\"slack bus voltage angle\", color=Cycled(2))\naxislegend(ax)\nfig #hide","category":"page"},{"location":"ModelingConcepts/#Internals","page":"Modeling Concepts","title":"Internals","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"Internally, we use different input/output conventions for bus and line models. The predefined models BusBar() and LineEnd() are defined in the following way:","category":"page"},{"location":"ModelingConcepts/#Model:-BusBar()","page":"Modeling Concepts","title":"Model: BusBar()","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"A busbar is a concrete model used in bus modeling. It represents the physical connection within a bus, the thing where all injectors and lines attach.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"           ┌──────────┐\ni_lines ──→│          │  (t)\n           │  Busbar  ├───o\n  u_bus ←──│          │\n           └──────────┘","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"It receives the sum of all line currents as an input and equals that to the currents flowing into the terminal. As an output, it gives forwards the terminal voltage to the backend.","category":"page"},{"location":"ModelingConcepts/#Model:-LineEnd()","page":"Modeling Concepts","title":"Model: LineEnd()","text":"","category":"section"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"A LineEnd model is very similar to the BusBar model. It represents one end of a transmission line.","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"          ┌───────────┐\n u_bus ──→│           │  (t)\n          │  LineEnd  ├───o\ni_line ←──│           │\n          └───────────┘","category":"page"},{"location":"ModelingConcepts/","page":"Modeling Concepts","title":"Modeling Concepts","text":"It has special input/output connectors which handle the network interconnection. The main difference beeing the different input/output conventions for the network interface.","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = OpPoDyn","category":"page"},{"location":"#OpPoDyn","page":"Home","title":"OpPoDyn","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for OpPoDyn.","category":"page"},{"location":"#Project-Structure","page":"Home","title":"Project Structure","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The project is structured as follows","category":"page"},{"location":"","page":"Home","title":"Home","text":"OpPoDyn/\n├── assets: contains asses for reference tests\n├── docs: contains this documentation\n├── OpPoDynTesting: helper package for testing, defines test utilities like reference tests\n├── Project.toml\n├── src: source code\n│   ├── Library: submodule for library, all the models live here\n│   └── ...\n└── test: test code","category":"page"},{"location":"","page":"Home","title":"Home","text":"At this stage, this project is meant to be used with the main branch from NetworkDynamics. Unfortunately, it also depends on the unregistered subpackage OpPoDynTesting which makes instantiating the environment a bit tricky (because you can neither add NetworkDynamics#main nor OpPoDyntesting#../OpPoDynTesting without it complaining about the other dependency. Thanks to the [sources] block in Project.toml in Julia v1.11, this shouldn'te be a problem anymore.","category":"page"},{"location":"","page":"Home","title":"Home","text":"If you want to use the realse version of Julia v1.10 I suggest to create a new development environment:","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> pwd() # make sure you're in the right folder\n\".../.julia/dev/OpPoDyn\"\n\n(v1.10) pkg> activate devenv\n\n(devenv) pkg> dev NetworkDynamics\n\n(devenv) pkg> dev ./OpPoDyntesting\n\n(devenv) pkg> dev .","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [OpPoDyn]","category":"page"},{"location":"#OpPoDyn.ModelMetadataConstructor","page":"Home","title":"OpPoDyn.ModelMetadataConstructor","text":"This type wraps the default constructor of a ModelingToolkit.Model and allows to attach metadata to it. Two types of metadata is possible:\n\na \"name\" field which will become the \"name\" field of the system\na named tuple with aribrary fields which will become the \"metadata\" field of the system\n\n\n\n\n\n","category":"type"},{"location":"#OpPoDyn.@attach_metadata!-Tuple{Any, Any}","page":"Home","title":"OpPoDyn.@attach_metadata!","text":"@attach_metadata! Model metadata\n\nAllows you to attach additonal metadata to a Model which was previously defined using @mtkmodel. The metadata needs to be in the form of a named tuple (; name=..., field1=..., field2=...).\n\nIf name is present in the metadata, it will be used as the default name of the system and stripped from the metadata. The rest of the named tuple will be attachde to the ODESystems metadata.\n\n\n\n\n\n","category":"macro"},{"location":"#Funding","page":"Home","title":"Funding","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Development of this project was in part funded by the German Federal Ministry for Economic Affairs and Climate Action as part of the OpPoDyn-Project (Project ID 01258425/1, 2024-2027).","category":"page"},{"location":"","page":"Home","title":"Home","text":"<img src=\"assets/bmwklogoen.svg\" width=\"300\"/>","category":"page"}]
}
