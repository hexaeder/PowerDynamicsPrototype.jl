using OpPoDyn
using OpPoDyn.Library
using ModelingToolkit
using NetworkDynamics
using Graphs
using OrdinaryDiffEqRosenbrock
using OrdinaryDiffEqNonlinearSolve
using GLMakie

Ae, Be = Library.solve_ceilf(3.3 => 0.6602, 4.5 => 4.2662)

@mtkmodel GenBus begin
    @components begin
        machine = SauerPaiMachine(;
            vf_input=true,
            τ_m_input=true,
            S_b=100,
            V_b=1,
            ω_b=2π*60,
            R_s=0.000125,
            T″_d0=0.01,
            T″_q0=0.01,
            X_d, X′_d, X″_d, X_q, X′_q, X″_q, X_ls, T′_d0, T′_q0, H # free per machine parameter
        )
        avr = AVRTypeI(vr_min=-5, vr_max=5, Ka=20, Ta=0.2, Kf=0.063,
            Tf=0.35, Ke=1, Te=0.314, Ae, Be, tmeas_lag=false)
        gov = TGOV1(R=0.05, T1=0.05, T2=2.1, T3=7.0, DT=0, V_max=5, V_min=-5)
        busbar = BusBar()
    end
    @equations begin
        connect(machine.terminal, busbar.terminal)
        connect(machine.v_mag_out, avr.vh)
        connect(avr.vf, machine.vf_in)
        connect(gov.τ_m, machine.τ_m_in)
        connect(machine.ωout, gov.ω_meas)
    end
end

@mtkmodel LoadBus begin
    @components begin
        busbar = BusBar()
        load = PQLoad(Pset, Qset)
    end
    @equations begin
        connect(load.terminal, busbar.terminal)
    end
end

gen1p = (;machine__X_ls=0.01460, machine__X_d=0.1460, machine__X′_d=0.0608, machine__X″_d=0.06, machine__X_q=0.1000, machine__X′_q=0.0969, machine__X″_q=0.06, machine__T′_d0=8.96, machine__T′_q0=0.310, machine__H=23.64)
gen2p = (;machine__X_ls=0.08958, machine__X_d=0.8958, machine__X′_d=0.1198, machine__X″_d=0.11, machine__X_q=0.8645, machine__X′_q=0.1969, machine__X″_q=0.11, machine__T′_d0=6.00, machine__T′_q0=0.535, machine__H= 6.40)
gen3p = (;machine__X_ls=0.13125, machine__X_d=1.3125, machine__X′_d=0.1813, machine__X″_d=0.18, machine__X_q=1.2578, machine__X′_q=0.2500, machine__X″_q=0.18, machine__T′_d0=5.89, machine__T′_q0=0.600, machine__H= 3.01)

@named mtkbus1 = GenBus(; gen1p...)
@named mtkbus2 = GenBus(; gen2p...)
@named mtkbus3 = GenBus(; gen3p...)
@named mtkbus4 = MTKBus()
@named mtkbus5 = LoadBus(;load__Pset=-1.25, load__Qset=-0.5)
@named mtkbus6 = LoadBus(;load__Pset=-0.90, load__Qset=-0.3)
@named mtkbus7 = MTKBus()
@named mtkbus8 = LoadBus(;load__Pset=-1.0, load__Qset=-0.35)
@named mtkbus9 = MTKBus()

# now we're creating the networkdynamic models from the mtk models
@named bus1 = Bus(mtkbus1; vidx=1)
@named bus2 = Bus(mtkbus2; vidx=2)
@named bus3 = Bus(mtkbus3; vidx=3)
@named bus4 = Bus(mtkbus4; vidx=4)
@named bus5 = Bus(mtkbus5; vidx=5)
@named bus6 = Bus(mtkbus6; vidx=6)
@named bus7 = Bus(mtkbus7; vidx=7)
@named bus8 = Bus(mtkbus8; vidx=8)
@named bus9 = Bus(mtkbus9; vidx=9)

# Branches
function piline(; R, X, B)
    @named pibranch = PiLine(;R, X, B_src=B/2, B_dst=B/2, G_src=0, G_dst=0)
    MTKLine(pibranch)
end
function transformer(; R, X)
    @named transformer = PiLine(;R, X, B_src=0, B_dst=0, G_src=0, G_dst=0)
    MTKLine(transformer)
end

@named l45 = Line(piline(; R=0.0100, X=0.0850, B=0.1760), src=4, dst=5)
@named l46 = Line(piline(; R=0.0170, X=0.0920, B=0.1580), src=4, dst=6)
@named l57 = Line(piline(; R=0.0320, X=0.1610, B=0.3060), src=5, dst=7)
@named l69 = Line(piline(; R=0.0390, X=0.1700, B=0.3580), src=6, dst=9)
@named l78 = Line(piline(; R=0.0085, X=0.0720, B=0.1490), src=7, dst=8)
@named l89 = Line(piline(; R=0.0119, X=0.1008, B=0.2090), src=8, dst=9)
@named t14 = Line(transformer(; R=0, X=0.0576), src=1, dst=4)
@named t27 = Line(transformer(; R=0, X=0.0625), src=2, dst=7)
@named t39 = Line(transformer(; R=0, X=0.0586), src=3, dst=9)


# to initialize the system, we use the provided setpoint
set_voltage!(bus1; mag=1.040, arg=deg2rad( 0.0))
set_voltage!(bus2; mag=1.025, arg=deg2rad( 9.3))
set_voltage!(bus3; mag=1.025, arg=deg2rad( 4.7))
set_voltage!(bus4; mag=1.026, arg=deg2rad(-2.2))
set_voltage!(bus5; mag=0.996, arg=deg2rad(-4.0))
set_voltage!(bus6; mag=1.013, arg=deg2rad(-3.7))
set_voltage!(bus7; mag=1.026, arg=deg2rad( 3.7))
set_voltage!(bus8; mag=1.016, arg=deg2rad( 0.7))
set_voltage!(bus9; mag=1.032, arg=deg2rad( 2.0))

#generators
set_current!(bus1; P= 0.716, Q= 0.270)
set_current!(bus2; P= 1.630, Q= 0.067)
set_current!(bus3; P= 0.850, Q=-0.109)

# initialize the internal states of the genertor busses
initialize_component!(bus1)
initialize_component!(bus2)
initialize_component!(bus3)

vertexfs = [bus1, bus2, bus3, bus4, bus5, bus6, bus7, bus8, bus9];
edgefs = [l45, l46, l57, l69, l78, l89, t14, t27, t39];
nw = Network(vertexfs, edgefs)
u0 = NWState(nw)
prob = ODEProblem(nw, uflat(u0), (0,100), pflat(u0))
sol = solve(prob, Rodas5P())
nothing


fig = Figure(size=(1000,2000));
ax = Axis(fig[1, 1]; title="Active power")
for i in [1,2,3,5,6,8]
    lines!(ax, sol; idxs=VIndex(i,:busbar₊P), label="Bus $i", color=Cycled(i))
end
axislegend(ax)
ax = Axis(fig[2, 1]; title="Voltage magnitude")
for i in 1:9
    lines!(ax, sol; idxs=VIndex(i,:busbar₊u_mag), label="Bus $i", color=Cycled(i))
end
axislegend(ax)
ax = Axis(fig[3, 1]; title="Voltag angel")
for i in 1:9
    lines!(ax, sol; idxs=VIndex(i,:busbar₊u_arg), label="Bus $i", color=Cycled(i))
end
axislegend(ax)
ax = Axis(fig[4, 1]; title="Frequency")
for i in 1:3
    lines!(ax, sol; idxs=VIndex(i,:machine₊ω), label="Bus $i", color=Cycled(i))
end
axislegend(ax)
fig
