const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{
        .default_target = .{
            .os_tag = .windows,
            .abi = .gnu,
        },
    });
    const optimize = b.standardOptimizeOption(.{});

    const raylib_mod = b.createModule(.{
        .root_source_file = b.path("src/engine_zig/raylib.zig"),
    });

    const engine_mod = b.createModule(.{
        .root_source_file = b.path("src/engine_zig/test_runner.zig"),
        .target = target,
        .optimize = optimize,
    });
    engine_mod.addImport("raylib", raylib_mod);

    const test_filter = b.option([]const u8, "test-filter", "Skip tests that do not match filter");

    const unit_tests = b.addTest(.{
        .root_module = engine_mod,
        .filters = if (test_filter) |f| &.{f} else &.{},
    });

    // Permite compilar o executável de teste em zig-out/bin/test.exe para colocar breakpoints
    const install_unit_tests = b.addInstallArtifact(unit_tests, .{});
    const build_test_step = b.step("build-test", "Build test binary for debugging");
    build_test_step.dependOn(&install_unit_tests.step);

    const run_unit_tests = b.addRunArtifact(unit_tests);
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_unit_tests.step);
}
