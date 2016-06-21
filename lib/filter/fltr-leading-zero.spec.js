describe("leadingZero", function () {
    beforeEach(module("trialsTrackmap"));

    var $filter,
        filterName = "leadingZero"

    beforeEach(inject(function(_$filter_){
        $filter = _$filter_;
    }));

    it("exists", function() {
        expect($filter(filterName)).not.toBeNull();
    })

    describe("test filter", function () {
        it("should handle correct", function(){
            expect($filter(filterName)()).toBe("")
            expect($filter(filterName)(undefined)).toBe("")
            expect($filter(filterName)([])).toBe("")
            expect($filter(filterName)({})).toBe("")
            expect($filter(filterName)("")).toBe("")
        })

        it("should be correct", function () {
            expect($filter(filterName)(10)).toBe("10")
            expect($filter(filterName)(10,1)).toBe("10")
            expect($filter(filterName)(10,2)).toBe("10")
            expect($filter(filterName)(10,3)).toBe("010")
            expect($filter(filterName)(10,4)).toBe("0010")
            expect($filter(filterName)(10,5)).toBe("00010")
        })
    })
})