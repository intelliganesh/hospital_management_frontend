const useColors = () => {
    const colors = ["#007bff", "#6c757d", "#28a745", "#dc3545", "#ffc107", "#17a2b8", "#343a40", "#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe", "#20c997", "#fd7e14", "#adb5bd", "#6610f2", "#e83e8c", "#0d6efd", "#6c757d"]
    
    const getColor: (index: number) => string = (index: number) => {
        return colors[index]
    }

    return { getColor }
}

export default useColors